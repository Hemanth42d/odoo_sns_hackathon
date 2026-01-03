const express = require("express");
const { body, validationResult, param } = require("express-validator");
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

router.get("/", auth, async (req, res) => {
  try {
    const { tripId } = req.params;
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

    res.json({
      success: true,
      data: {
        itinerary: permissionCheck.trip.itinerary,
        tripInfo: {
          id: permissionCheck.trip._id,
          name: permissionCheck.trip.name,
          startDate: permissionCheck.trip.startDate,
          endDate: permissionCheck.trip.endDate,
          duration: permissionCheck.trip.duration,
          numberOfTravelers: permissionCheck.trip.numberOfTravelers,
          budgetTracking: permissionCheck.trip.budgetTracking,
        },
      },
    });
  } catch (error) {
    console.error("Get itinerary error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching itinerary",
    });
  }
});

router.put(
  "/",
  [auth, body("stops").isArray().withMessage("Stops must be an array")],
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

      const { tripId } = req.params;
      const { stops } = req.body;

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

      // Validate stops data
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        if (!stop.name || !stop.arrivalDate || !stop.departureDate) {
          return res.status(400).json({
            success: false,
            message: `Stop ${
              i + 1
            }: Name, arrival date, and departure date are required`,
          });
        }

        const arrivalDate = new Date(stop.arrivalDate);
        const departureDate = new Date(stop.departureDate);

        if (departureDate <= arrivalDate) {
          return res.status(400).json({
            success: false,
            message: `Stop ${i + 1}: Departure date must be after arrival date`,
          });
        }
      }

      // Update itinerary
      const updatedTrip = await Trip.findByIdAndUpdate(
        tripId,
        {
          "itinerary.stops": stops,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: "Itinerary updated successfully",
        data: {
          itinerary: updatedTrip.itinerary,
        },
      });
    } catch (error) {
      console.error("Update itinerary error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating itinerary",
      });
    }
  }
);

router.post(
  "/stops",
  [
    auth,
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Stop name must be at least 2 characters"),
    body("country")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Country must be at least 2 characters"),
    body("arrivalDate").isISO8601().withMessage("Invalid arrival date"),
    body("departureDate").isISO8601().withMessage("Invalid departure date"),
    body("dailyBudget")
      .optional()
      .isNumeric()
      .withMessage("Daily budget must be a number"),
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

      const { tripId } = req.params;
      const {
        name,
        country,
        arrivalDate,
        departureDate,
        dailyBudget = 100,
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

      // Validate dates
      const arrival = new Date(arrivalDate);
      const departure = new Date(departureDate);

      if (departure <= arrival) {
        return res.status(400).json({
          success: false,
          message: "Departure date must be after arrival date",
        });
      }

      // Calculate duration
      const duration = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));

      // Create new stop
      const newStop = {
        name,
        country,
        arrivalDate: arrival,
        departureDate: departure,
        duration,
        accommodation: {
          name: "",
          type: "hotel",
          pricePerNight: 0,
          nights: duration,
          totalCost: 0,
          checkIn: arrival,
          checkOut: departure,
        },
        dailyBudget,
        totalBudget: dailyBudget * duration,
        spentBudget: 0,
        activities: [],
        transportation: {},
        notes: "",
        order: permissionCheck.trip.itinerary.stops.length,
      };

      // Add stop to trip
      const updatedTrip = await Trip.findByIdAndUpdate(
        tripId,
        {
          $push: { "itinerary.stops": newStop },
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      res.status(201).json({
        success: true,
        message: "Stop added successfully",
        data: {
          stop: updatedTrip.itinerary.stops[
            updatedTrip.itinerary.stops.length - 1
          ],
        },
      });
    } catch (error) {
      console.error("Add stop error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while adding stop",
      });
    }
  }
);

router.put(
  "/stops/:stopId",
  [
    auth,
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Stop name must be at least 2 characters"),
    body("arrivalDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid arrival date"),
    body("departureDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid departure date"),
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

      // Update stop data
      const updateData = req.body;

      // Validate dates if provided
      if (updateData.arrivalDate && updateData.departureDate) {
        const arrival = new Date(updateData.arrivalDate);
        const departure = new Date(updateData.departureDate);

        if (departure <= arrival) {
          return res.status(400).json({
            success: false,
            message: "Departure date must be after arrival date",
          });
        }

        // Recalculate duration
        updateData.duration = Math.ceil(
          (departure - arrival) / (1000 * 60 * 60 * 24)
        );

        // Update accommodation nights
        if (trip.itinerary.stops[stopIndex].accommodation) {
          updateData.accommodation = {
            ...trip.itinerary.stops[stopIndex].accommodation,
            nights: updateData.duration,
            checkIn: arrival,
            checkOut: departure,
          };
        }
      }

      // Recalculate total budget
      const currentStop = trip.itinerary.stops[stopIndex];
      const accommodationCost = updateData.accommodation
        ? updateData.accommodation.totalCost ||
          currentStop.accommodation.totalCost
        : currentStop.accommodation.totalCost;
      const dailyBudget = updateData.dailyBudget || currentStop.dailyBudget;
      const duration = updateData.duration || currentStop.duration;
      const activitiesCost = currentStop.activities.reduce(
        (sum, activity) => sum + (activity.cost || 0),
        0
      );

      updateData.totalBudget =
        accommodationCost + dailyBudget * duration + activitiesCost;

      // Update the stop
      Object.keys(updateData).forEach((key) => {
        if (key === "accommodation" && updateData[key]) {
          trip.itinerary.stops[stopIndex].accommodation = {
            ...trip.itinerary.stops[stopIndex].accommodation,
            ...updateData[key],
          };
        } else {
          trip.itinerary.stops[stopIndex][key] = updateData[key];
        }
      });

      trip.updatedAt = new Date();
      await trip.save();

      res.json({
        success: true,
        message: "Stop updated successfully",
        data: {
          stop: trip.itinerary.stops[stopIndex],
        },
      });
    } catch (error) {
      console.error("Update stop error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating stop",
      });
    }
  }
);

router.delete("/stops/:stopId", auth, async (req, res) => {
  try {
    const { tripId, stopId } = req.params;

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

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      {
        $pull: { "itinerary.stops": { _id: stopId } },
        updatedAt: new Date(),
      },
      { new: true }
    );

    // Reorder remaining stops
    updatedTrip.itinerary.stops.forEach((stop, index) => {
      stop.order = index;
    });
    await updatedTrip.save();

    res.json({
      success: true,
      message: "Stop deleted successfully",
      data: {
        itinerary: updatedTrip.itinerary,
      },
    });
  } catch (error) {
    console.error("Delete stop error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting stop",
    });
  }
});

router.put(
  "/stops/reorder",
  [auth, body("stopIds").isArray().withMessage("Stop IDs must be an array")],
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

      const { tripId } = req.params;
      const { stopIds } = req.body;

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

      // Validate that all stop IDs exist
      if (stopIds.length !== trip.itinerary.stops.length) {
        return res.status(400).json({
          success: false,
          message: "Number of stop IDs must match current number of stops",
        });
      }

      // Reorder stops
      const reorderedStops = [];
      for (let i = 0; i < stopIds.length; i++) {
        const stop = trip.itinerary.stops.find(
          (s) => s._id.toString() === stopIds[i]
        );
        if (!stop) {
          return res.status(400).json({
            success: false,
            message: `Stop with ID ${stopIds[i]} not found`,
          });
        }
        stop.order = i;
        reorderedStops.push(stop);
      }

      trip.itinerary.stops = reorderedStops;
      trip.updatedAt = new Date();
      await trip.save();

      res.json({
        success: true,
        message: "Stops reordered successfully",
        data: {
          itinerary: trip.itinerary,
        },
      });
    } catch (error) {
      console.error("Reorder stops error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while reordering stops",
      });
    }
  }
);

module.exports = router;
