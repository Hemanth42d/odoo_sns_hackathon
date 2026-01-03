const express = require("express");
const { query, validationResult } = require("express-validator");
const { auth, optionalAuth } = require("../middleware/auth");
const { defaultLimit } = require("../middleware/rateLimiter");
const searchService = require("../services/searchService");

const router = express.Router();

router.get(
  "/trips",
  [
    optionalAuth,
    defaultLimit,
    query("q")
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage("Query must be 1-100 characters"),
    query("theme")
      .optional()
      .isIn([
        "adventure",
        "cultural",
        "relaxation",
        "business",
        "family",
        "solo",
        "romantic",
        "educational",
      ]),
    query("status").optional().isIn(["planning", "active", "completed"]),
    query("country").optional().isLength({ max: 50 }),
    query("minBudget").optional().isFloat({ min: 0 }),
    query("maxBudget").optional().isFloat({ min: 0 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("offset").optional().isInt({ min: 0 }),
    query("sortBy")
      .optional()
      .isIn(["relevance", "date", "budget", "popularity", "name"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { q, ...filters } = req.query;
      const userId = req.user?._id;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const result = await searchService.searchTrips(q, filters, userId);

      res.json({
        success: true,
        data: {
          trips: result.trips,
          pagination: {
            total: result.total,
            limit: parseInt(filters.limit) || 20,
            offset: parseInt(filters.offset) || 0,
            hasMore:
              (parseInt(filters.offset) || 0) +
                (parseInt(filters.limit) || 20) <
              result.total,
          },
        },
      });
    } catch (error) {
      console.error("Search trips error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during search",
      });
    }
  }
);

router.get(
  "/users",
  [
    auth,
    defaultLimit,
    query("q")
      .isLength({ min: 1, max: 100 })
      .withMessage("Query must be 1-100 characters"),
    query("limit").optional().isInt({ min: 1, max: 20 }),
    query("offset").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { q, ...filters } = req.query;
      const result = await searchService.searchUsers(q, filters);

      res.json({
        success: true,
        data: {
          users: result.users,
          pagination: {
            total: result.total,
            limit: parseInt(filters.limit) || 10,
            offset: parseInt(filters.offset) || 0,
            hasMore:
              (parseInt(filters.offset) || 0) +
                (parseInt(filters.limit) || 10) <
              result.total,
          },
        },
      });
    } catch (error) {
      console.error("Search users error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during user search",
      });
    }
  }
);

router.get(
  "/destinations/popular",
  [defaultLimit, query("limit").optional().isInt({ min: 1, max: 50 })],
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const destinations = await searchService.getPopularDestinations(limit);

      res.json({
        success: true,
        data: { destinations },
      });
    } catch (error) {
      console.error("Get popular destinations error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching popular destinations",
      });
    }
  }
);

router.get(
  "/suggestions",
  [
    defaultLimit,
    query("q")
      .isLength({ min: 2, max: 50 })
      .withMessage("Query must be 2-50 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const suggestions = await searchService.getSuggestions(req.query.q);

      res.json({
        success: true,
        data: { suggestions },
      });
    } catch (error) {
      console.error("Get suggestions error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching suggestions",
      });
    }
  }
);

module.exports = router;
