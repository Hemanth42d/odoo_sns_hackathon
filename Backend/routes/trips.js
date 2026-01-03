const express = require("express");
const { body, validationResult, query } = require("express-validator");
const Trip = require("../Models/Trip");
const User = require("../Models/User");
const { auth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/",
  [
    auth,
    query("status")
      .optional()
      .isIn(["planning", "active", "completed", "cancelled"]),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("offset").optional().isInt({ min: 0 }),
    query("sortBy")
      .optional()
      .isIn(["createdAt", "startDate", "endDate", "name"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        status,
        limit = 20,
        offset = 0,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      // Build query
      const query = {
        $or: [{ owner: req.user._id }, { "collaborators.user": req.user._id }],
      };

      if (status) {
        query.status = status;
      }

      // Build sort object
      const sortObj = {};
      sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

      // Execute query
      const trips = await Trip.find(query)
        .populate("owner", "firstName lastName email")
        .populate("collaborators.user", "firstName lastName email")
        .sort(sortObj)
        .limit(parseInt(limit))
        .skip(parseInt(offset));

      // Get total count for pagination
      const totalCount = await Trip.countDocuments(query);

      res.json({
        success: true,
        data: {
          trips,
          pagination: {
            total: totalCount,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + parseInt(limit) < totalCount,
          },
        },
      });
    } catch (error) {
      console.error("Get trips error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching trips",
      });
    }
  }
);

router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("owner", "firstName lastName email")
      .populate("collaborators.user", "firstName lastName email");

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // Check permissions
    const isOwner =
      req.user && trip.owner._id.toString() === req.user._id.toString();
    const isCollaborator =
      req.user &&
      trip.collaborators.some(
        (collab) => collab.user._id.toString() === req.user._id.toString()
      );
    const isPublic = trip.isPublic;

    if (!isOwner && !isCollaborator && !isPublic) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this trip",
      });
    }

    // Increment views if public trip
    if (isPublic && !isOwner && !isCollaborator) {
      await Trip.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    }

    res.json({
      success: true,
      data: {
        trip,
      },
    });
  } catch (error) {
    console.error("Get trip error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching trip",
    });
  }
});

router.post(
  "/",
  [
    auth,
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Trip name must be at least 3 characters"),
    body("startDate").isISO8601().withMessage("Invalid start date"),
    body("endDate").isISO8601().withMessage("Invalid end date"),
    body("numberOfTravelers")
      .isInt({ min: 1 })
      .withMessage("Number of travelers must be at least 1"),
    body("theme")
      .optional()
      .isIn([
        "adventure",
        "cultural",
        "relaxation",
        "business",
        "romantic",
        "family",
        "solo",
        "foodie",
      ]),
    body("travelStyle")
      .optional()
      .isIn(["budget", "comfort", "luxury", "backpacker", "business"]),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        name,
        description,
        startDate,
        endDate,
        numberOfTravelers,
        theme,
        travelStyle,
        interests,
        budgetTracking,
        initialDestination,
      } = req.body;

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: "End date must be after start date",
        });
      }

      if (start < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Start date cannot be in the past",
        });
      }

      // Create initial stop if destination provided
      const itinerary = { stops: [] };
      if (initialDestination) {
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        itinerary.stops.push({
          name: initialDestination,
          country: "",
          arrivalDate: start,
          departureDate: end,
          duration: duration,
          accommodation: {
            name: "",
            type: "hotel",
            pricePerNight: 0,
            nights: duration,
            totalCost: 0,
            checkIn: start,
            checkOut: end,
          },
          dailyBudget:
            budgetTracking && budgetTracking.totalBudget
              ? Math.round(budgetTracking.totalBudget / duration)
              : 100,
          totalBudget: 0,
          spentBudget: 0,
          activities: [],
          transportation: {},
          notes: "",
          order: 0,
        });
      }

      // Create trip
      const trip = new Trip({
        name,
        description: description || "",
        owner: req.user._id,
        startDate: start,
        endDate: end,
        numberOfTravelers,
        theme,
        travelStyle: travelStyle || "comfort",
        interests: interests || [],
        budgetTracking: {
          totalBudget: budgetTracking ? budgetTracking.totalBudget : 0,
          spent: 0,
          categories: {
            accommodation: 0,
            transportation: 0,
            food: 0,
            activities: 0,
            shopping: 0,
            other: 0,
          },
        },
        itinerary,
        collaborators: [
          {
            user: req.user._id,
            role: "owner",
            permissions: ["edit", "delete", "invite", "view"],
          },
        ],
        status: "planning",
        progress: {
          destinations: initialDestination ? 1 : 0,
          accommodations: 0,
          activities: 0,
          transportation: 0,
          completed: false,
        },
      });

      await trip.save();

      // Update user statistics
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { "statistics.totalTrips": 1 },
      });

      // Populate and return
      const populatedTrip = await Trip.findById(trip._id)
        .populate("owner", "firstName lastName email")
        .populate("collaborators.user", "firstName lastName email");

      res.status(201).json({
        success: true,
        message: "Trip created successfully",
        data: {
          trip: populatedTrip,
        },
      });
    } catch (error) {
      console.error("Create trip error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating trip",
      });
    }
  }
);

router.put(
  "/:id",
  [
    auth,
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Trip name must be at least 3 characters"),
    body("startDate").optional().isISO8601().withMessage("Invalid start date"),
    body("endDate").optional().isISO8601().withMessage("Invalid end date"),
    body("numberOfTravelers")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Number of travelers must be at least 1"),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const trip = await Trip.findById(req.params.id);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      // Check permissions
      const isOwner = trip.owner.toString() === req.user._id.toString();
      const collaborator = trip.collaborators.find(
        (collab) => collab.user.toString() === req.user._id.toString()
      );
      const hasEditPermission =
        collaborator && collaborator.permissions.includes("edit");

      if (!isOwner && !hasEditPermission) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions to edit this trip",
        });
      }

      // Validate dates if provided
      const { startDate, endDate } = req.body;
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
          return res.status(400).json({
            success: false,
            message: "End date must be after start date",
          });
        }
      }

      // Update trip
      const updatedTrip = await Trip.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate("owner", "firstName lastName email")
        .populate("collaborators.user", "firstName lastName email");

      res.json({
        success: true,
        message: "Trip updated successfully",
        data: {
          trip: updatedTrip,
        },
      });
    } catch (error) {
      console.error("Update trip error:", error);

      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid trip ID",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error while updating trip",
      });
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // Check permissions (only owner can delete)
    const isOwner = trip.owner.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only trip owner can delete the trip",
      });
    }

    await Trip.findByIdAndDelete(req.params.id);

    // Update user statistics
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "statistics.totalTrips": -1 },
    });

    res.json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Delete trip error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while deleting trip",
    });
  }
});

module.exports = router;
