const DonationDrive = require("../models/donationDriveModel");
const Donor = require("../models/donorModel");
const DriveParticipant = require("../models/driveParticipantModel");

// CREATE DRIVE (ADMIN)
exports.createDrive = async (req, res) => {
  try {
    const {
      title,
      location,
      date,
      time,
      description,
      maxParticipants,
      status
    } = req.body || {};

    if (!title || !location || !date || !time) {
      return res.status(400).json({
        message: "Title, location, date, and time are required"
      });
    }

    const drive = await DonationDrive.create({
      title,
      location,
      date,
      time,
      description: description || "",
      maxParticipants: maxParticipants ?? null,
      status: status || "Upcoming",
      imageURL: req.file ? `/uploads/drives/${req.file.filename}` : "",
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Donation drive created successfully",
      drive
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create donation drive",
      error: error.message
    });
  }
};

// GET ALL DRIVES
exports.getAllDrives = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await DonationDrive.countDocuments();

    const drives = await DonationDrive.find()
      .populate("createdBy", "name email role")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    let donor = null;

    if (req.user?.role !== "pho_admin") {
      donor = await Donor.findOne({ userId: req.user._id });
    }

    const driveIds = drives.map((drive) => drive._id);

    const participants = await DriveParticipant.find({
      driveId: { $in: driveIds }
    });

    const formattedDrives = drives.map((drive) => {
      const driveObj = drive.toObject();

      const driveParticipants = participants.filter(
        (participant) => participant.driveId.toString() === drive._id.toString()
      );

      const registered = driveParticipants.filter((participant) =>
        ["joined", "attended"].includes(participant.status)
      ).length;

      let myParticipationStatus = null;
      let hasJoined = false;

      if (donor) {
        const myParticipant = driveParticipants.find(
          (participant) => participant.donorId.toString() === donor._id.toString()
        );

        if (myParticipant) {
          myParticipationStatus = myParticipant.status;
          hasJoined = myParticipant.status === "joined";
        }
      }

      return {
        ...driveObj,
        registered,
        hasJoined,
        myParticipationStatus
      };
    });

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      data: formattedDrives,
      currentPage: page,
      totalPages,
      totalItems
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch donation drives",
      error: error.message
    });
  }
};

// UPDATE DRIVE (ADMIN)
exports.updateDriveById = async (req, res) => {
  try {
    const {
      title,
      location,
      date,
      time,
      description,
      maxParticipants,
      status
    } = req.body || {};

    const drive = await DonationDrive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        message: "Donation drive not found"
      });
    }

    if (req.file) {
      req.body.imageURL = `/uploads/drives/${req.file.filename}`;
    }

    drive.title = title || drive.title;
    drive.location = location || drive.location;
    drive.date = date || drive.date;
    drive.time = time || drive.time;
    drive.description =
      description !== undefined ? description : drive.description;
    drive.maxParticipants =
      maxParticipants !== undefined ? maxParticipants : drive.maxParticipants;
    drive.status = status || drive.status;
    drive.imageURL = req.body.imageURL || drive.imageURL;

    const updatedDrive = await drive.save();

    res.status(200).json({
      message: "Donation drive updated successfully",
      drive: updatedDrive
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update donation drive",
      error: error.message
    });
  }
};

// DELETE DRIVE (ADMIN)
exports.deleteDriveById = async (req, res) => {
  try {
    const drive = await DonationDrive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        message: "Donation drive not found"
      });
    }

    await drive.deleteOne();

    res.status(200).json({
      message: "Donation drive deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete donation drive",
      error: error.message
    });
  }
};