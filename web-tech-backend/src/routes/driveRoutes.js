const express = require("express");
const router = express.Router();

const {
  createDrive,
  getAllDrives,
  updateDriveById,
  deleteDriveById
} = require("../controllers/driveController");

const uploadDriveImage = require("../middleware/uploadDriveImage");

const {
  joinDrive,
  getDriveParticipants,
  updateDriveParticipantStatus,
  cancelMyDriveParticipation,
  addManualDriveParticipant
} = require("../controllers/driveParticipantController");

const { protect, authorize } = require("../middleware/authMiddleware");

// all logged-in users/admin can view drives
router.get("/", protect, getAllDrives);

// donor joins a drive
router.post("/:id/join", protect, joinDrive);

// donor cancels own participation
router.put("/:id/cancel", protect, cancelMyDriveParticipation);

// admin views drive participants
router.get("/:id/participants", protect, authorize("pho_admin"), getDriveParticipants);

// admin manually adds donor to drive
router.post(
  "/:id/participants/manual",
  protect,
  authorize("pho_admin"),
  addManualDriveParticipant
);

// admin updates drive participant status
router.put(
  "/participants/:id",
  protect,
  authorize("pho_admin"),
  updateDriveParticipantStatus
);

// admin only
router.post(
  "/",
  protect,
  authorize("pho_admin"),
  uploadDriveImage.single("image"),
  createDrive
);
router.put("/:id", protect, authorize("pho_admin"), uploadDriveImage.single("image"), updateDriveById);
router.delete("/:id", protect, authorize("pho_admin"), deleteDriveById);

module.exports = router;