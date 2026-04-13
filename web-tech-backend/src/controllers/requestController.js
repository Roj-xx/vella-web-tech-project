const Request = require("../models/requestModel");
const Donor = require("../models/donorModel");
const RequestParticipant = require("../models/requestParticipantModel");

// CREATE BLOOD REQUEST (ADMIN)
exports.createRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      maxParticipants,
      bloodType,
      urgency,
      venue,
      date,
      startTime,
      status
    } = req.body || {};

    if (!title || !bloodType || !urgency || !venue || !date || !startTime) {
      return res.status(400).json({
        message:
          "Title, blood type, urgency, venue, date, and start time are required"
      });
    }

    const request = await Request.create({
      title,
      description: description || "",
      maxParticipants: maxParticipants || 0,
      bloodType,
      urgency,
      venue,
      date,
      startTime,
      status: status || "Pending",
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Blood request created successfully",
      request
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create blood request",
      error: error.message
    });
  }
};

// GET ALL BLOOD REQUESTS
exports.getAllRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await Request.countDocuments();

    const requests = await Request.find()
      .populate("createdBy", "name email role")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    let donor = null;

    if (req.user?.role !== "pho_admin") {
      donor = await Donor.findOne({ userId: req.user._id });
    }

    const requestIds = requests.map((request) => request._id);

    const participants = await RequestParticipant.find({
      requestId: { $in: requestIds }
    });

    const formattedRequests = requests.map((request) => {
      const requestObj = request.toObject();

      const requestParticipants = participants.filter(
        (participant) => participant.requestId.toString() === request._id.toString()
      );

      const joinedCount = requestParticipants.filter((participant) =>
        ["joined", "attended"].includes(participant.status)
      ).length;

      let myParticipationStatus = null;
      let hasJoined = false;

      if (donor) {
        const myParticipant = requestParticipants.find(
          (participant) => participant.donorId.toString() === donor._id.toString()
        );

        if (myParticipant) {
          myParticipationStatus = myParticipant.status;
          hasJoined = myParticipant.status === "joined";
        }
      }

      return {
        ...requestObj,
        joinedCount,
        hasJoined,
        myParticipationStatus
      };
    });

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      data: formattedRequests,
      currentPage: page,
      totalPages,
      totalItems
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blood requests",
      error: error.message
    });
  }
};

// UPDATE BLOOD REQUEST (ADMIN)
exports.updateRequestById = async (req, res) => {
  try {
    const {
      title,
      description,
      maxParticipants,
      bloodType,
      urgency,
      status,
      venue,
      date,
      startTime
    } = req.body || {};

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found"
      });
    }

    request.bloodType = bloodType || request.bloodType;
    request.urgency = urgency || request.urgency;
    request.status = status || request.status;
    request.venue = venue || request.venue;
    request.date = date || request.date;
    request.startTime = startTime || request.startTime;
    request.title = title || request.title;
    request.description =
      description !== undefined ? description : request.description;
    request.maxParticipants =
      maxParticipants !== undefined ? maxParticipants : request.maxParticipants;

    const updatedRequest = await request.save();

    res.status(200).json({
      message: "Blood request updated successfully",
      request: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update blood request",
      error: error.message
    });
  }
};

// DELETE BLOOD REQUEST (ADMIN)
exports.deleteRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found"
      });
    }

    await request.deleteOne();

    res.status(200).json({
      message: "Blood request deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete blood request",
      error: error.message
    });
  }
};