const Donor = require("../models/donorModel");
const DonationDrive = require("../models/donationDriveModel");
const DriveParticipant = require("../models/driveParticipantModel");
const RequestParticipant = require("../models/requestParticipantModel");

// ================= LANDING STATS =================
exports.getLandingStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    const thirtyFiveDaysAgo = new Date();
    thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35);

    const totalDonors = await Donor.countDocuments();

    const upcomingDonationDrives = await DonationDrive.countDocuments({
      status: "Upcoming"
    });

    // get attended participants
    const attendedDriveParticipants = await DriveParticipant.find({
      status: "attended",
      attendedAt: { $ne: null }
    }).select("attendedAt");

    const attendedRequestParticipants = await RequestParticipant.find({
      status: "attended",
      attendedAt: { $ne: null }
    }).select("attendedAt");

    const allAttendedParticipants = [
      ...attendedDriveParticipants,
      ...attendedRequestParticipants
    ];

    // current supply (last 35 days)
    const currentBloodSupply = allAttendedParticipants.filter(
      (p) =>
        p.attendedAt &&
        new Date(p.attendedAt) >= thirtyFiveDaysAgo
    ).length;

    // annual collected
    const annualCollectedUnits = allAttendedParticipants.filter((p) => {
      if (!p.attendedAt) return false;
      return new Date(p.attendedAt).getFullYear() === currentYear;
    }).length;

    const annualTarget = 2265;

    const annualCollectedPercentage =
      annualTarget > 0
        ? Number(((annualCollectedUnits / annualTarget) * 100).toFixed(2))
        : 0;

    res.status(200).json({
      totalDonors,
      currentBloodSupply,
      annualTarget,
      annualCollectedUnits,
      annualCollectedPercentage,
      upcomingDonationDrives
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch landing stats",
      error: error.message
    });
  }
};

// ================= PUBLIC UPCOMING DRIVES =================
exports.getUpcomingDrives = async (req, res) => {
  try {
    const drives = await DonationDrive.find({
      status: "Upcoming"
    })
      .sort({ createdAt: -1 })
      .limit(6);

    const driveIds = drives.map((d) => d._id);

    // get participants for those drives
    const participants = await DriveParticipant.find({
      driveId: { $in: driveIds }
    });

    const formattedDrives = drives.map((drive) => {
      const driveObj = drive.toObject();

      const driveParticipants = participants.filter(
        (p) => p.driveId.toString() === drive._id.toString()
      );

      // count only active participants
      const registered = driveParticipants.filter((p) =>
        ["joined", "attended"].includes(p.status)
      ).length;

      return {
        ...driveObj,
        registered, // 🔥 THIS IS WHAT YOUR FRONTEND NEEDS
        maxParticipants: drive.maxParticipants || 0
      };
    });

    res.status(200).json({
      data: formattedDrives
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch upcoming donation drives",
      error: error.message
    });
  }
};