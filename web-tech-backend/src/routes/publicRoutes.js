const express = require("express");
const router = express.Router();
const {
  getLandingStats,
  getUpcomingDrives
} = require("../controllers/publicController");

router.get("/landing-stats", getLandingStats);
router.get("/upcoming-drives", getUpcomingDrives);

module.exports = router;