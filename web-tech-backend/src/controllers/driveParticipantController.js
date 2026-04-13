const DonationDrive = require("../models/donationDriveModel");
const Donor = require("../models/donorModel");
const DriveParticipant = require("../models/driveParticipantModel");

// DONOR JOINS A DRIVE
exports.joinDrive = async (req, res) => {
  try {
    const driveId = req.params.id;

    const donor = await Donor.findOne({ userId: req.user._id });

    if (!donor) {
      return res.status(404).json({
        message: "Donor profile not found"
      });
    }

    if (!donor.isProfileComplete) {
      return res.status(400).json({
        message: "Complete your donor profile first before joining a donation drive"
      });
    }

    const drive = await DonationDrive.findById(driveId);

    if (!drive) {
      return res.status(404).json({
        message: "Donation drive not found"
      });
    }

    if (drive.status !== "Upcoming") {
      return res.status(400).json({
        message: "This donation drive is no longer open for participation"
      });
    }

    let existingParticipant = await DriveParticipant.findOne({
      driveId,
      donorId: donor._id
    });

    const activeParticipantCount = await DriveParticipant.countDocuments({
      driveId,
      status: { $in: ["joined", "attended"] }
    });

    if (existingParticipant) {
      if (["joined", "attended"].includes(existingParticipant.status)) {
        return res.status(400).json({
          message: "You have already joined this donation drive"
        });
      }

      if (drive.maxParticipants !== null && activeParticipantCount >= drive.maxParticipants) {
        return res.status(400).json({
          message: "This donation drive has already reached its participant limit"
        });
      }

      existingParticipant.status = "joined";
      existingParticipant.registeredAt = new Date();
      existingParticipant.attendedAt = null;

      const updatedParticipant = await existingParticipant.save();

      return res.status(200).json({
        message: "Successfully rejoined the donation drive",
        participant: updatedParticipant
      });
    }

    if (drive.maxParticipants !== null && activeParticipantCount >= drive.maxParticipants) {
      return res.status(400).json({
        message: "This donation drive has already reached its participant limit"
      });
    }

    const participant = await DriveParticipant.create({
      driveId,
      donorId: donor._id,
      status: "joined"
    });

    res.status(201).json({
      message: "Successfully joined the donation drive",
      participant
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to join donation drive",
      error: error.message
    });
  }
};

// ADMIN GETS ALL PARTICIPANTS OF A DRIVE
exports.getDriveParticipants = async (req, res) => {
  try {
    const driveId = req.params.id;

    const drive = await DonationDrive.findById(driveId);

    if (!drive) {
      return res.status(404).json({
        message: "Donation drive not found"
      });
    }

    const participants = await DriveParticipant.find({ driveId })
      .populate({
        path: "donorId",
        populate: {
          path: "userId",
          select: "name email role"
        }
      })
      .sort({ createdAt: -1 });

    const formattedParticipants = participants.map((participant) => ({
      _id: participant._id,
      driveId: participant.driveId,
      status: participant.status,
      registeredAt: participant.registeredAt,
      attendedAt: participant.attendedAt,
      donor: participant.donorId
        ? {
            _id: participant.donorId._id,
            displayName: participant.donorId.userId
              ? participant.donorId.userId.name
              : participant.donorId.fullName,
            email: participant.donorId.userId ? participant.donorId.userId.email : null,
            role: participant.donorId.userId ? participant.donorId.userId.role : null,
            isRegisteredUser: participant.donorId.isRegisteredUser,
            fullName: participant.donorId.fullName,
            userId: participant.donorId.userId,
            bloodType: participant.donorId.bloodType,
            address: participant.donorId.address,
            contactNumber: participant.donorId.contactNumber,
            lastDonationDate: participant.donorId.lastDonationDate,
            isProfileComplete: participant.donorId.isProfileComplete
          }
        : null
    }));

    res.status(200).json({
      drive,
      totalParticipants: formattedParticipants.length,
      participants: formattedParticipants
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch drive participants",
      error: error.message
    });
  }
};

// ADMIN UPDATES DRIVE PARTICIPANT STATUS
exports.updateDriveParticipantStatus = async (req, res) => {
  try {
    const { status } = req.body || {};

    const allowedStatuses = ["joined", "attended", "missed", "cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Valid status is required: joined, attended, missed, or cancelled"
      });
    }

    const participant = await DriveParticipant.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({
        message: "Drive participant not found"
      });
    }

    participant.status = status;

    if (status === "attended") {
      participant.attendedAt = new Date();
    } else {
      participant.attendedAt = null;
    }

    const updatedParticipant = await participant.save();

    res.status(200).json({
      message: "Drive participant status updated successfully",
      participant: updatedParticipant
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update drive participant status",
      error: error.message
    });
  }
};

// DONOR CANCELS THEIR OWN DRIVE PARTICIPATION
exports.cancelMyDriveParticipation = async (req, res) => {
  try {
    const driveId = req.params.id;

    const donor = await Donor.findOne({ userId: req.user._id });

    if (!donor) {
      return res.status(404).json({
        message: "Donor profile not found"
      });
    }

    const participant = await DriveParticipant.findOne({
      driveId,
      donorId: donor._id
    });

    if (!participant) {
      return res.status(404).json({
        message: "You have not joined this donation drive"
      });
    }

    if (participant.status !== "joined") {
      return res.status(400).json({
        message: "You can only cancel a participation that is still marked as joined"
      });
    }

    participant.status = "cancelled";
    participant.attendedAt = null;

    const updatedParticipant = await participant.save();

    res.status(200).json({
      message: "Your drive participation has been cancelled successfully",
      participant: updatedParticipant
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel drive participation",
      error: error.message
    });
  }
};

// ADMIN MANUALLY ADDS A DONOR TO A DONATION DRIVE
exports.addManualDriveParticipant = async (req, res) => {
  try {
    const driveId = req.params.id;
    const { donorId } = req.body || {};

    if (!donorId) {
      return res.status(400).json({
        message: "Donor ID is required"
      });
    }

    const drive = await DonationDrive.findById(driveId);

    if (!drive) {
      return res.status(404).json({
        message: "Donation drive not found"
      });
    }

    if (drive.status !== "Upcoming") {
      return res.status(400).json({
        message: "This donation drive is no longer open for participation"
      });
    }

    const donor = await Donor.findById(donorId).populate("userId", "name email role");

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found"
      });
    }

    const existingParticipant = await DriveParticipant.findOne({
      driveId,
      donorId: donor._id
    });

    if (existingParticipant) {
      return res.status(400).json({
        message: "This donor is already added to the donation drive"
      });
    }

    if (drive.maxParticipants !== null) {
      const participantCount = await DriveParticipant.countDocuments({
        driveId,
        status: { $in: ["joined", "attended"] }
      });

      if (participantCount >= drive.maxParticipants) {
        return res.status(400).json({
          message: "This donation drive has already reached its participant limit"
        });
      }
    }

    const participant = await DriveParticipant.create({
      driveId,
      donorId: donor._id,
      status: "joined"
    });

    res.status(201).json({
      message: "Donor added to donation drive successfully",
      participant: {
        _id: participant._id,
        driveId: participant.driveId,
        donorId: participant.donorId,
        status: participant.status,
        registeredAt: participant.registeredAt,
        attendedAt: participant.attendedAt
      },
      donor: {
        _id: donor._id,
        displayName: donor.userId ? donor.userId.name : donor.fullName,
        email: donor.userId ? donor.userId.email : null,
        role: donor.userId ? donor.userId.role : null,
        isRegisteredUser: donor.isRegisteredUser,
        bloodType: donor.bloodType,
        isProfileComplete: donor.isProfileComplete
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add donor to donation drive",
      error: error.message
    });
  }
};