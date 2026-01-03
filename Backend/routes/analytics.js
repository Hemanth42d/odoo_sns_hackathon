const express = require("express");
const { auth } = require("../middleware/auth");
const { defaultLimit } = require("../middleware/rateLimiter");
const analyticsService = require("../services/analyticsService");

const router = express.Router();

// Get trip analytics
router.get("/trips/:tripId", [auth, defaultLimit], async (req, res) => {
  try {
    const analytics = await analyticsService.getTripAnalytics(
      req.params.tripId,
      req.user._id
    );

    res.json({
      success: true,
      data: { analytics },
    });
  } catch (error) {
    console.error("Get trip analytics error:", error);

    if (error.message === "Trip not found") {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (error.message === "Insufficient permissions") {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions to view analytics",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching trip analytics",
    });
  }
});

// Get user analytics
router.get("/users/me", [auth, defaultLimit], async (req, res) => {
  try {
    const analytics = await analyticsService.getUserAnalytics(req.user._id);

    res.json({
      success: true,
      data: { analytics },
    });
  } catch (error) {
    console.error("Get user analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching user analytics",
    });
  }
});

// Get global analytics (admin only - for future use)
router.get("/global", [auth, defaultLimit], async (req, res) => {
  try {
    // For now, allow any authenticated user to see global stats
    // In the future, you might want to restrict this to admin users
    const analytics = await analyticsService.getGlobalAnalytics();

    res.json({
      success: true,
      data: { analytics },
    });
  } catch (error) {
    console.error("Get global analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching global analytics",
    });
  }
});

module.exports = router;
