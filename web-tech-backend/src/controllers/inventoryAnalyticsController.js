const DriveParticipant = require("../models/driveParticipantModel");
const RequestParticipant = require("../models/requestParticipantModel");

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const getStockStatus = (units) => {
  if (units >= 15) return "high";
  if (units >= 5) return "normal";
  return "low";
};

exports.getInventorySummary = async (req, res) => {
  try {
    const thirtyFiveDaysAgo = new Date();
    thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35);

    // get all attended participants from donation drives
    const attendedDriveParticipants = await DriveParticipant.find({
      status: "attended",
      attendedAt: { $ne: null }
    }).populate("donorId", "bloodType");

    // get all attended participants from blood requests
    const attendedRequestParticipants = await RequestParticipant.find({
      status: "attended",
      attendedAt: { $ne: null }
    }).populate("donorId", "bloodType");

    // combine both sources
    const allAttendedParticipants = [
      ...attendedDriveParticipants,
      ...attendedRequestParticipants
    ];

    // apply 35-day expiration logic
    const currentInventoryParticipants = allAttendedParticipants.filter(
      (participant) =>
        participant.attendedAt &&
        new Date(participant.attendedAt) >= thirtyFiveDaysAgo
    );

    // initialize counters for all 8 blood types
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

    let pendingUnits = 0;
    let latestUpdatedAt = null;

    // count units
    for (const participant of currentInventoryParticipants) {
      if (!participant.donorId) continue;

      const donorBloodType = participant.donorId.bloodType || "unknown";

      if (
        participant.attendedAt &&
        (!latestUpdatedAt || participant.attendedAt > latestUpdatedAt)
      ) {
        latestUpdatedAt = participant.attendedAt;
      }

      if (donorBloodType === "unknown") {
        pendingUnits += 1;
      } else if (bloodTypeCounts.hasOwnProperty(donorBloodType)) {
        bloodTypeCounts[donorBloodType] += 1;
      }
    }

    // build blood type cards and keep all 8 even if zero
    const bloodTypes = BLOOD_TYPES.map((bloodType) => {
      const units = bloodTypeCounts[bloodType];
      return {
        bloodType,
        units,
        status: getStockStatus(units)
      };
    });

    // summary counts
    const lowStockCount = bloodTypes.filter((item) => item.status === "low").length;
    const normalStockCount = bloodTypes.filter(
      (item) => item.status === "normal"
    ).length;
    const highStockCount = bloodTypes.filter((item) => item.status === "high").length;

    const totalClassifiedUnits = bloodTypes.reduce((sum, item) => sum + item.units, 0);
    const totalUnits = totalClassifiedUnits + pendingUnits;

    res.status(200).json({
      summary: {
        totalUnits,
        lowStockCount,
        normalStockCount,
        highStockCount
      },
      pending: {
        units: pendingUnits
      },
      bloodTypes,
      lastUpdated: latestUpdatedAt
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch inventory summary",
      error: error.message
    });
  }
};