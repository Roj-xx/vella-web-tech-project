const Donor = require("../models/donorModel");
const Request = require("../models/requestModel");
const DonationDrive = require("../models/donationDriveModel");
const DriveParticipant = require("../models/driveParticipantModel");
const RequestParticipant = require("../models/requestParticipantModel");

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getStockStatus = (units) => {
  if (units >= 15) return "high";
  if (units >= 5) return "normal";
  return "low";
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    const thirtyFiveDaysAgo = new Date();
    thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35);

    // top cards basic counts
    const totalBloodDonors = await Donor.countDocuments();
    const pendingBloodRequests = await Request.countDocuments({ status: "Pending" });
    const upcomingDonationDrives = await DonationDrive.countDocuments({
      status: "Upcoming"
    });

    // all attended participants for historical analytics
    const attendedDriveParticipants = await DriveParticipant.find({
      status: "attended",
      attendedAt: { $ne: null }
    }).populate("donorId", "bloodType");

    const attendedRequestParticipants = await RequestParticipant.find({
      status: "attended",
      attendedAt: { $ne: null }
    }).populate("donorId", "bloodType");

    const allAttendedParticipants = [
      ...attendedDriveParticipants,
      ...attendedRequestParticipants
    ];

    // current available inventory = not expired (within 35 days)
    const currentInventoryParticipants = allAttendedParticipants.filter(
      (participant) => participant.attendedAt && new Date(participant.attendedAt) >= thirtyFiveDaysAgo
    );

    const bloodTypeCounts = {
      "A+": 0,
      "A-": 0,
      "B+": 0,
      "B-": 0,
      "AB+": 0,
      "AB-": 0,
      "O+": 0,
      "O-": 0
    };

    let availableBloodUnits = 0;

    for (const participant of currentInventoryParticipants) {
      if (!participant.donorId) continue;

      const bloodType = participant.donorId.bloodType || "unknown";

      // available units includes both known and unknown within 35 days
      availableBloodUnits += 1;

      if (bloodType !== "unknown" && bloodTypeCounts.hasOwnProperty(bloodType)) {
        bloodTypeCounts[bloodType] += 1;
      }
    }

    // low stock alerts from current inventory only
    const criticalBloodStockAlerts = BLOOD_TYPES.map((bloodType) => {
      const units = bloodTypeCounts[bloodType];
      return {
        bloodType,
        units,
        status: getStockStatus(units)
      };
    }).filter((item) => item.status === "low");

    // monthly trend for current year (historical, no expiration)
    const monthlyCounts = new Array(12).fill(0);

    for (const participant of allAttendedParticipants) {
      if (!participant.attendedAt) continue;

      const attendedDate = new Date(participant.attendedAt);
      const year = attendedDate.getFullYear();

      if (year === currentYear) {
        const monthIndex = attendedDate.getMonth();
        monthlyCounts[monthIndex] += 1;
      }
    }

    const monthlyDonationTrend = MONTH_LABELS.map((label, index) => ({
      month: label,
      units: monthlyCounts[index]
    }));

    // annual progress (historical, no expiration)
    const annualCollectedUnits = monthlyCounts.reduce((sum, units) => sum + units, 0);
    const annualTarget = 2265;
    const collectedPercentageRaw = (annualCollectedUnits / annualTarget) * 100;
    const collectedPercentage = Number(collectedPercentageRaw.toFixed(2));
    const remainingUnits = Math.max(annualTarget - annualCollectedUnits, 0);
    const remainingPercentage = Number(Math.max(100 - collectedPercentageRaw, 0).toFixed(2));

    res.status(200).json({
      topCards: {
        totalBloodDonors,
        availableBloodUnits,
        pendingBloodRequests,
        upcomingDonationDrives
      },
      monthlyDonationTrend,
      annualProgress: {
        collectedUnits: annualCollectedUnits,
        targetUnits: annualTarget,
        collectedPercentage,
        remainingUnits,
        remainingPercentage
      },
      criticalBloodStockAlerts
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message
    });
  }
};