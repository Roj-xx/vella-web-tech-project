const express = require("express");
const router = express.Router();
const { getInventorySummary } = require("../controllers/inventoryAnalyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

// admin-only inventory analytics
router.get("/summary", protect, authorize("pho_admin"), getInventorySummary);

module.exports = router;