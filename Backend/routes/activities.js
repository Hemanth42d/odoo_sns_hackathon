const express = require("express");
const { body, validationResult } = require("express-validator");
const Trip = require("../Models/Trip");
const { auth } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

// Helper function to check trip permissions
const checkTripPermission = async (
  tripId,
  userId,
  requiredPermission = "view"
) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    return { success: false, message: "Trip not found" };
  }

  const isOwner = trip.owner.toString() === userId.toString();
  const collaborator = trip.collaborators.find(
    (collab) => collab.user.toString() === userId.toString()
  );

  let hasPermission = isOwner;
  if (!hasPermission && collaborator) {
    hasPermission = collaborator.permissions.includes(requiredPermission);
  }

  if (!hasPermission) {
    return {
      success: false,
      message: `Insufficient permissions to ${requiredPermission} this trip`,
    };
  }

  return { success: true, trip };
};

router.post(
  "/",
  [
    auth,
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Activity name must be at least 2 characters"),
    body("day").isInt({ min: 1 }).withMessage("Day must be a positive integer"),
    body("startTime")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Invalid start time format (HH:MM)"),
    body("endTime")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Invalid end time format (HH:MM)"),
    body("category").isIn([
      "sightseeing",
      "food",
      "adventure",
      "culture",
      "shopping",
      "relaxation",
      "transport",
      "other",
    ]),
    body("cost").optional().isNumeric().withMessage("Cost must be a number"),
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

      const { tripId, stopId } = req.params;
      const {
        name,
        day,
        startTime,
        endTime,
        category,
        cost = 0,
        description = "",
        location = "",
        bookingRequired = false,
        notes = "",
      } = req.body;

      const permissionCheck = await checkTripPermission(
        tripId,
        req.user._id,
        "edit"
      );
      if (!permissionCheck.success) {
        return res
          .status(permissionCheck.message === "Trip not found" ? 404 : 403)
          .json({
            success: false,
            message: permissionCheck.message,
          });
      }

      const trip = permissionCheck.trip;
      const stopIndex = trip.itinerary.stops.findIndex(
        (stop) => stop._id.toString() === stopId
      );

      if (stopIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Stop not found",
        });
      }

      const stop = trip.itinerary.stops[stopIndex];

      // Validate that day is within stop duration
      if (day > stop.duration) {
        return res.status(400).json({
          success: false,
          message: `Day ${day} is beyond stop duration of ${stop.duration} days`,
        });
      }

      // Validate time range
      if (startTime >= endTime) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time",
        });
      }

      // Create new activity
      const newActivity = {
        day,
        name,
        category,
        startTime,
        endTime,
        cost,
        description,
        location,
        bookingRequired,
        notes,
        isCompleted: false,
      };

      // Add activity to stop
      stop.activities.push(newActivity);

      // Recalculate stop total budget
      const accommodationCost = stop.accommodation.totalCost || 0;
      const dailyCost = stop.dailyBudget * stop.duration;
      const activitiesCost = stop.activities.reduce(
        (sum, activity) => sum + (activity.cost || 0),
        0
      );
      stop.totalBudget = accommodationCost + dailyCost + activitiesCost;

      trip.updatedAt = new Date();
      await trip.save();

      const addedActivity = stop.activities[stop.activities.length - 1];

      res.status(201).json({
        success: true,
        message: "Activity added successfully",
        data: {
          activity: addedActivity,
          stopBudget: {
            totalBudget: stop.totalBudget,
            activitiesCost,
          },
        },
      });
    } catch (error) {
      console.error("Add activity error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while adding activity",
      });
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const { day } = req.query;

    const permissionCheck = await checkTripPermission(
      tripId,
      req.user._id,
      "view"
    );
    if (!permissionCheck.success) {
      return res
        .status(permissionCheck.message === "Trip not found" ? 404 : 403)
        .json({
          success: false,
          message: permissionCheck.message,
        });
    }

    const trip = permissionCheck.trip;
    const stop = trip.itinerary.stops.find((s) => s._id.toString() === stopId);

    if (!stop) {
      return res.status(404).json({
        success: false,
        message: "Stop not found",
      });
    }

    let activities = stop.activities;

    // Filter by day if specified
    if (day) {
      activities = activities.filter(
        (activity) => activity.day === parseInt(day)
      );
    }

    // Sort by start time
    activities.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json({
      success: true,
      data: {
        activities,
        stopInfo: {
          id: stop._id,
          name: stop.name,
          duration: stop.duration,
          totalActivities: stop.activities.length,
          totalActivitiesCost: stop.activities.reduce(
            (sum, activity) => sum + (activity.cost || 0),
            0
          ),
        },
      },
    });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching activities",
    });
  }
});

router.put(
  "/:activityId",
  [
    auth,
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Activity name must be at least 2 characters"),
    body("day")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Day must be a positive integer"),
    body("startTime")
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Invalid start time format (HH:MM)"),
    body("endTime")
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Invalid end time format (HH:MM)"),
    body("category")
      .optional()
      .isIn([
        "sightseeing",
        "food",
        "adventure",
        "culture",
        "shopping",
        "relaxation",
        "transport",
        "other",
      ]),
    body("cost").optional().isNumeric().withMessage("Cost must be a number"),
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

      const { tripId, stopId, activityId } = req.params;

      const permissionCheck = await checkTripPermission(
        tripId,
        req.user._id,
        "edit"
      );
      if (!permissionCheck.success) {
        return res
          .status(permissionCheck.message === "Trip not found" ? 404 : 403)
          .json({
            success: false,
            message: permissionCheck.message,
          });
      }

      const trip = permissionCheck.trip;
      const stopIndex = trip.itinerary.stops.findIndex(
        (stop) => stop._id.toString() === stopId
      );

      if (stopIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Stop not found",
        });
      }

      const stop = trip.itinerary.stops[stopIndex];
      const activityIndex = stop.activities.findIndex(
        (activity) => activity._id.toString() === activityId
      );

      if (activityIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Activity not found",
        });
      }

      const updateData = req.body;

      // Validate day if provided
      if (updateData.day && updateData.day > stop.duration) {
        return res.status(400).json({
          success: false,
          message: `Day ${updateData.day} is beyond stop duration of ${stop.duration} days`,
        });
      }

      // Validate time range if both times provided
      if (
        updateData.startTime &&
        updateData.endTime &&
        updateData.startTime >= updateData.endTime
      ) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time",
        });
      }

      // Update activity
      Object.keys(updateData).forEach((key) => {
        stop.activities[activityIndex][key] = updateData[key];
      });

      // Recalculate stop total budget
      const accommodationCost = stop.accommodation.totalCost || 0;
      const dailyCost = stop.dailyBudget * stop.duration;
      const activitiesCost = stop.activities.reduce(
        (sum, activity) => sum + (activity.cost || 0),
        0
      );
      stop.totalBudget = accommodationCost + dailyCost + activitiesCost;

      trip.updatedAt = new Date();
      await trip.save();

      res.json({
        success: true,
        message: "Activity updated successfully",
        data: {
          activity: stop.activities[activityIndex],
          stopBudget: {
            totalBudget: stop.totalBudget,
            activitiesCost,
          },
        },
      });
    } catch (error) {
      console.error("Update activity error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating activity",
      });
    }
  }
);

router.delete("/:activityId", auth, async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;

    const permissionCheck = await checkTripPermission(
      tripId,
      req.user._id,
      "edit"
    );
    if (!permissionCheck.success) {
      return res
        .status(permissionCheck.message === "Trip not found" ? 404 : 403)
        .json({
          success: false,
          message: permissionCheck.message,
        });
    }

    const trip = permissionCheck.trip;
    const stopIndex = trip.itinerary.stops.findIndex(
      (stop) => stop._id.toString() === stopId
    );

    if (stopIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Stop not found",
      });
    }

    const stop = trip.itinerary.stops[stopIndex];
    const activityIndex = stop.activities.findIndex(
      (activity) => activity._id.toString() === activityId
    );

    if (activityIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Remove activity
    stop.activities.splice(activityIndex, 1);

    // Recalculate stop total budget
    const accommodationCost = stop.accommodation.totalCost || 0;
    const dailyCost = stop.dailyBudget * stop.duration;
    const activitiesCost = stop.activities.reduce(
      (sum, activity) => sum + (activity.cost || 0),
      0
    );
    stop.totalBudget = accommodationCost + dailyCost + activitiesCost;

    trip.updatedAt = new Date();
    await trip.save();

    res.json({
      success: true,
      message: "Activity deleted successfully",
      data: {
        stopBudget: {
          totalBudget: stop.totalBudget,
          activitiesCost,
        },
      },
    });
  } catch (error) {
    console.error("Delete activity error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting activity",
    });
  }
});

router.put("/:activityId/complete", auth, async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;
    const { isCompleted, rating, notes } = req.body;

    const permissionCheck = await checkTripPermission(
      tripId,
      req.user._id,
      "edit"
    );
    if (!permissionCheck.success) {
      return res
        .status(permissionCheck.message === "Trip not found" ? 404 : 403)
        .json({
          success: false,
          message: permissionCheck.message,
        });
    }

    const trip = permissionCheck.trip;
    const stop = trip.itinerary.stops.find((s) => s._id.toString() === stopId);

    if (!stop) {
      return res.status(404).json({
        success: false,
        message: "Stop not found",
      });
    }

    const activity = stop.activities.find(
      (a) => a._id.toString() === activityId
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Update completion status
    activity.isCompleted =
      isCompleted !== undefined ? isCompleted : !activity.isCompleted;

    if (rating && rating >= 1 && rating <= 5) {
      activity.rating = rating;
    }

    if (notes) {
      activity.notes = notes;
    }

    trip.updatedAt = new Date();
    await trip.save();

    res.json({
      success: true,
      message: `Activity ${
        activity.isCompleted ? "completed" : "marked as incomplete"
      }`,
      data: {
        activity,
      },
    });
  } catch (error) {
    console.error("Complete activity error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating activity completion",
    });
  }
});

module.exports = router;
