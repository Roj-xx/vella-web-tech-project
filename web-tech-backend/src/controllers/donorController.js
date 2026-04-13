const Donor = require("../models/donorModel");
const User = require("../models/userModel");

const getProfileCompletionStatus = ({ bloodType, address, contactNumber }) => {
  return (
    bloodType &&
    bloodType !== "unknown" &&
    address &&
    address.trim() !== "" &&
    contactNumber &&
    contactNumber.trim() !== ""
  );
};

// CREATE DONOR PROFILE FOR LOGGED-IN USER
exports.createDonorProfile = async (req, res) => {
  try {
    const { bloodType, address, contactNumber, lastDonationDate } = req.body || {};

    const existingDonor = await Donor.findOne({ userId: req.user._id });

    if (existingDonor) {
      return res.status(400).json({
        message: "Donor profile already exists for this user"
      });
    }

    const donorBloodType = bloodType || "unknown";
    const donorAddress = address || "";
    const donorContactNumber = contactNumber || "";

    const isProfileComplete = getProfileCompletionStatus({
      bloodType: donorBloodType,
      address: donorAddress,
      contactNumber: donorContactNumber
    });

    const donor = await Donor.create({
      fullName: "",
      userId: req.user._id,
      isRegisteredUser: true,
      bloodType: donorBloodType,
      address: donorAddress,
      contactNumber: donorContactNumber,
      lastDonationDate: lastDonationDate || null,
      isProfileComplete
    });

    res.status(201).json({
      message: "Donor profile created successfully",
      donor
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create donor profile",
      error: error.message
    });
  }
};

// ADMIN CREATES MANUAL DONOR
exports.createManualDonor = async (req, res) => {
  try {
    const { fullName, bloodType, address, contactNumber, lastDonationDate } = req.body || {};

    if (!fullName || fullName.trim() === "") {
      return res.status(400).json({
        message: "Full name is required for manual donor creation"
      });
    }

    const donorBloodType = bloodType || "unknown";
    const donorAddress = address || "";
    const donorContactNumber = contactNumber || "";

    const isProfileComplete = getProfileCompletionStatus({
      bloodType: donorBloodType,
      address: donorAddress,
      contactNumber: donorContactNumber
    });

    const donor = await Donor.create({
      fullName: fullName.trim(),
      userId: null,
      isRegisteredUser: false,
      bloodType: donorBloodType,
      address: donorAddress,
      contactNumber: donorContactNumber,
      lastDonationDate: lastDonationDate || null,
      isProfileComplete
    });

    res.status(201).json({
      message: "Manual donor created successfully",
      donor
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create manual donor",
      error: error.message
    });
  }
};

// GET ALL DONORS (ADMIN) WITH SEARCH + FILTERS
exports.getAllDonors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const search = (req.query.search || "").trim().toLowerCase();
    const bloodType = (req.query.bloodType || "").trim();
    const includeUnknown = req.query.includeUnknown === "true";
    const isProfileComplete = req.query.isProfileComplete;
    const isRegisteredUser = req.query.isRegisteredUser;

    const donors = await Donor.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    let formattedDonors = donors.map((donor) => ({
      _id: donor._id,
      displayName: donor.userId ? donor.userId.name : donor.fullName,
      email: donor.userId ? donor.userId.email : null,
      role: donor.userId ? donor.userId.role : null,
      isRegisteredUser: donor.isRegisteredUser,
      fullName: donor.fullName,
      userId: donor.userId,
      bloodType: donor.bloodType,
      address: donor.address,
      contactNumber: donor.contactNumber,
      lastDonationDate: donor.lastDonationDate,
      isProfileComplete: donor.isProfileComplete,
      createdAt: donor.createdAt,
      updatedAt: donor.updatedAt
    }));

    // SEARCH: displayName or contactNumber
    if (search) {
      formattedDonors = formattedDonors.filter((donor) => {
        const nameMatch = donor.displayName?.toLowerCase().includes(search);
        const contactMatch = donor.contactNumber?.toLowerCase().includes(search);
        return nameMatch || contactMatch;
      });
    }

    // FILTER: blood type
    if (bloodType) {
      formattedDonors = formattedDonors.filter((donor) => {
        if (includeUnknown) {
          return donor.bloodType === bloodType || donor.bloodType === "unknown";
        }

        return donor.bloodType === bloodType;
      });
    }

    // FILTER: profile completion
    if (isProfileComplete === "true" || isProfileComplete === "false") {
      const profileCompleteBool = isProfileComplete === "true";
      formattedDonors = formattedDonors.filter(
        (donor) => donor.isProfileComplete === profileCompleteBool
      );
    }

    // FILTER: registered/manual donor
    if (isRegisteredUser === "true" || isRegisteredUser === "false") {
      const registeredUserBool = isRegisteredUser === "true";
      formattedDonors = formattedDonors.filter(
        (donor) => donor.isRegisteredUser === registeredUserBool
      );
    }

    const totalItems = formattedDonors.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedDonors = formattedDonors.slice(startIndex, endIndex);

    res.status(200).json({
      data: paginatedDonors,
      currentPage: page,
      totalPages,
      totalItems
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch donors",
      error: error.message
    });
  }
};

// GET MY DONOR PROFILE
exports.getMyDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email role"
    );

    if (!donor) {
      return res.status(404).json({
        message: "Donor profile not found"
      });
    }

    res.status(200).json({
      donor: {
        _id: donor._id,
        displayName: donor.userId ? donor.userId.name : donor.fullName,
        email: donor.userId ? donor.userId.email : null,
        role: donor.userId ? donor.userId.role : null,
        isRegisteredUser: donor.isRegisteredUser,
        fullName: donor.fullName,
        userId: donor.userId,
        bloodType: donor.bloodType,
        address: donor.address,
        contactNumber: donor.contactNumber,
        lastDonationDate: donor.lastDonationDate,
        isProfileComplete: donor.isProfileComplete,
        createdAt: donor.createdAt,
        updatedAt: donor.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch donor profile",
      error: error.message
    });
  }
};

// UPDATE DONOR (ADMIN)
exports.updateDonorById = async (req, res) => {
  try {
    const { fullName, bloodType, address, contactNumber, lastDonationDate } = req.body || {};

    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found"
      });
    }

    if (!donor.userId && fullName !== undefined) {
      donor.fullName = fullName;
    }

    donor.bloodType = bloodType || donor.bloodType;
    donor.address = address !== undefined ? address : donor.address;
    donor.contactNumber =
      contactNumber !== undefined ? contactNumber : donor.contactNumber;
    donor.lastDonationDate =
      lastDonationDate !== undefined ? lastDonationDate : donor.lastDonationDate;

    donor.isProfileComplete = getProfileCompletionStatus({
      bloodType: donor.bloodType,
      address: donor.address,
      contactNumber: donor.contactNumber
    });

    const updatedDonor = await donor.save();

    res.status(200).json({
      message: "Donor updated successfully",
      donor: updatedDonor
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update donor",
      error: error.message
    });
  }
};

// DELETE DONOR (ADMIN)
exports.deleteDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found"
      });
    }

    await donor.deleteOne();

    res.status(200).json({
      message: "Donor deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete donor",
      error: error.message
    });
  }
};

// UPDATE MY DONOR PROFILE
exports.updateMyDonorProfile = async (req, res) => {
  try {
    const { bloodType, address, contactNumber, lastDonationDate } = req.body || {};

    const donor = await Donor.findOne({ userId: req.user._id });

    if (!donor) {
      return res.status(404).json({
        message: "Donor profile not found"
      });
    }

    donor.bloodType = bloodType || donor.bloodType;
    donor.address = address !== undefined ? address : donor.address;
    donor.contactNumber =
      contactNumber !== undefined ? contactNumber : donor.contactNumber;
    donor.lastDonationDate =
      lastDonationDate !== undefined ? lastDonationDate : donor.lastDonationDate;

    donor.isProfileComplete = getProfileCompletionStatus({
      bloodType: donor.bloodType,
      address: donor.address,
      contactNumber: donor.contactNumber
    });

    const updatedDonor = await donor.save();

    res.status(200).json({
      message: "My donor profile updated successfully",
      donor: updatedDonor
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update donor profile",
      error: error.message
    });
  }
};