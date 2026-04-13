const express = require("express");
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  updateRequestById,
  deleteRequestById
} = require("../controllers/requestController");
const {
  joinRequest,
  getRequestParticipants,
  updateRequestParticipantStatus,
  cancelMyRequestParticipation,
  addManualRequestParticipant
} = require("../controllers/requestParticipantController");
const { protect, authorize } = require("../middleware/authMiddleware");

// all logged-in users can view blood requests
router.get("/", protect, getAllRequests);

// donor joins a blood request
router.post("/:id/join", protect, joinRequest);

// donor cancels own participation
router.put("/:id/cancel", protect, cancelMyRequestParticipation);

// admin views participants of a blood request
router.get("/:id/participants", protect, authorize("pho_admin"), getRequestParticipants);

// admin manually adds donor to request
router.post(
  "/:id/participants/manual",
  protect,
  authorize("pho_admin"),
  addManualRequestParticipant
);

// admin updates request participant status
router.put(
  "/participants/:id",
  protect,
  authorize("pho_admin"),
  updateRequestParticipantStatus
);

// admin only
router.post("/", protect, authorize("pho_admin"), createRequest);
router.put("/:id", protect, authorize("pho_admin"), updateRequestById);
router.delete("/:id", protect, authorize("pho_admin"), deleteRequestById);

module.exports = router;