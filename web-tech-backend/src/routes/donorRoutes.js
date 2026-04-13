const express = require("express");
const router = express.Router();
const {
  createDonorProfile,
  createManualDonor,
  getAllDonors,
  getMyDonorProfile,
  updateMyDonorProfile,
  updateDonorById,
  deleteDonorById
} = require("../controllers/donorController");
const { protect, authorize } = require("../middleware/authMiddleware");

// user creates own donor profile
router.post("/", protect, createDonorProfile);

// admin creates manual donor
router.post("/manual", protect, authorize("pho_admin"), createManualDonor);

// user views own donor profile
router.get("/me", protect, getMyDonorProfile);

// user updates own donor profile
router.put("/me", protect, updateMyDonorProfile);

// admin views all donors
router.get("/", protect, authorize("pho_admin"), getAllDonors);

// admin updates donor
router.put("/:id", protect, authorize("pho_admin"), updateDonorById);

// admin deletes donor
router.delete("/:id", protect, authorize("pho_admin"), deleteDonorById);

module.exports = router;