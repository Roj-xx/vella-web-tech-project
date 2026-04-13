const Request = require("../models/requestModel");
const Donor = require("../models/donorModel");
const RequestParticipant = require("../models/requestParticipantModel");

// DONOR JOINS A BLOOD REQUEST
exports.joinRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const donor = await Donor.findOne({ userId: req.user._id });

    if (!donor) {
      return res.status(404).json({
        message: "Donor profile not found"
      });
    }

    if (!donor.isProfileComplete) {
      return res.status(400).json({
        message: "Complete your donor profile first before joining a blood request"
      });
    }

    const bloodRequest = await Request.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found"
      });
    }

    if (bloodRequest.status !== "Pending") {
      return res.status(400).json({
        message: "This blood request is no longer open for participation"
      });
    }

    if (donor.bloodType !== bloodRequest.bloodType) {
      return res.status(400).json({
        message: "Your blood type does not match this blood request"
      });
    }

    let existingParticipant = await RequestParticipant.findOne({
      requestId,
      donorId: donor._id
    });

    const activeParticipantCount = await RequestParticipant.countDocuments({
      requestId,
      status: { $in: ["joined", "attended"] }
    });

    if (existingParticipant) {
      if (["joined", "attended"].includes(existingParticipant.status)) {
        return res.status(400).json({
          message: "You have already joined this blood request"
        });
      }

      if (
        bloodRequest.maxParticipants > 0 &&
        activeParticipantCount >= bloodRequest.maxParticipants
      ) {
        return res.status(400).json({
          message: "This blood request has already reached its participant limit"
        });
      }

      existingParticipant.status = "joined";
      existingParticipant.registeredAt = new Date();
      existingParticipant.attendedAt = null;

      const updatedParticipant = await existingParticipant.save();

      return res.status(200).json({
        message: "Successfully rejoined the blood request",
        participant: updatedParticipant
      });
    }

    if (
      bloodRequest.maxParticipants > 0 &&
      activeParticipantCount >= bloodRequest.maxParticipants
    ) {
      return res.status(400).json({
        message: "This blood request has already reached its participant limit"
      });
    }

    const participant = await RequestParticipant.create({
      requestId,
      donorId: donor._id,
      status: "joined"
    });

    res.status(201).json({
      message: "Successfully joined the blood request",
      participant
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to join blood request",
      error: error.message
    });
  }
};

// ADMIN GETS ALL PARTICIPANTS OF A BLOOD REQUEST
exports.getRequestParticipants = async (req, res) => {
  try {
    const requestId = req.params.id;

    const bloodRequest = await Request.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found"
      });
    }

    const participants = await RequestParticipant.find({ requestId })
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
      requestId: participant.requestId,
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
      request: bloodRequest,
      totalParticipants: formattedParticipants.length,
      participants: formattedParticipants
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch request participants",
      error: error.message
    });
  }
};

// ADMIN UPDATES REQUEST PARTICIPANT STATUS
exports.updateRequestParticipantStatus = async (req, res) => {
  try {
    const { status } = req.body || {};

    const allowedStatuses = ["joined", "attended", "missed", "cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Valid status is required: joined, attended, missed, or cancelled"
      });
    }

    const participant = await RequestParticipant.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({
        message: "Request participant not found"
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
      message: "Request participant status updated successfully",
      participant: updatedParticipant
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update request participant status",
      error: error.message
    });
  }
};

// DONOR CANCELS THEIR OWN REQUEST PARTICIPATION
exports.cancelMyRequestParticipation = async (req, res) => {
  try {
    const requestId = req.params.id;

    const donor = await Donor.findOne({ userId: req.user._id });

    if (!donor) {
      return res.status(404).json({
        message: "Donor profile not found"
      });
    }

    const participant = await RequestParticipant.findOne({
      requestId,
      donorId: donor._id
    });

    if (!participant) {
      return res.status(404).json({
        message: "You have not joined this blood request"
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
      message: "Your participation has been cancelled successfully",
      participant: updatedParticipant
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel participation",
      error: error.message
    });
  }
};

// ADMIN MANUALLY ADDS A DONOR TO A BLOOD REQUEST
exports.addManualRequestParticipant = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { donorId } = req.body || {};

    if (!donorId) {
      return res.status(400).json({
        message: "Donor ID is required"
      });
    }

    const bloodRequest = await Request.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found"
      });
    }

    if (bloodRequest.status !== "Pending") {
      return res.status(400).json({
        message: "This blood request is no longer open for participation"
      });
    }

    const donor = await Donor.findById(donorId).populate("userId", "name email role");

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found"
      });
    }

    const existingParticipant = await RequestParticipant.findOne({
      requestId,
      donorId: donor._id
    });

    if (existingParticipant) {
      return res.status(400).json({
        message: "This donor is already added to the blood request"
      });
    }

    if (
      bloodRequest.maxParticipants > 0
      && (await RequestParticipant.countDocuments({
        requestId,
        status: { $in: ["joined", "attended"] }
      })) >= bloodRequest.maxParticipants
    ) {
      return res.status(400).json({
        message: "This blood request has already reached its participant limit"
      });
    }

    const participant = await RequestParticipant.create({
      requestId,
      donorId: donor._id,
      status: "joined"
    });

    res.status(201).json({
      message: "Donor added to blood request successfully",
      participant: {
        _id: participant._id,
        requestId: participant.requestId,
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
      message: "Failed to add donor to blood request",
      error: error.message
    });
  }
};