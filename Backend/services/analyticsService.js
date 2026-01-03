const Trip = require("../Models/Trip");
const User = require("../Models/User");

class AnalyticsService {
  async getTripAnalytics(tripId, userId) {
    try {
      const trip = await Trip.findById(tripId);

      if (!trip) {
        throw new Error("Trip not found");
      }

      // Check permissions
      const isOwner = trip.owner.toString() === userId.toString();
      const collaborator = trip.collaborators.find(
        (collab) => collab.user.toString() === userId.toString()
      );
      const hasAnalyticsPermission =
        isOwner ||
        (collaborator && collaborator.permissions.includes("analytics"));

      if (!hasAnalyticsPermission) {
        throw new Error("Insufficient permissions");
      }

      const analytics = {
        views: trip.views || 0,
        likes: trip.likes || 0,
        shares: trip.shares || 0,
        collaborators: trip.collaborators.length,
        totalStops: trip.itinerary?.stops?.length || 0,
        totalActivities:
          trip.itinerary?.stops?.reduce(
            (total, stop) => total + (stop.activities?.length || 0),
            0
          ) || 0,
        budget: {
          total: trip.budget?.total || 0,
          spent: trip.budget?.spent || 0,
          remaining: (trip.budget?.total || 0) - (trip.budget?.spent || 0),
        },
        duration: trip.duration || 0,
        countries:
          [
            ...new Set(
              trip.itinerary?.stops
                ?.map((stop) => stop.location.country)
                .filter(Boolean)
            ),
          ] || [],
        cities:
          [
            ...new Set(
              trip.itinerary?.stops
                ?.map((stop) => stop.location.city)
                .filter(Boolean)
            ),
          ] || [],
      };

      return analytics;
    } catch (error) {
      throw error;
    }
  }

  async getUserAnalytics(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Get user's trips
      const userTrips = await Trip.find({
        $or: [{ owner: userId }, { "collaborators.user": userId }],
      });

      // Calculate statistics
      const totalTrips = userTrips.length;
      const completedTrips = userTrips.filter(
        (trip) => trip.status === "completed"
      ).length;
      const activeTrips = userTrips.filter(
        (trip) => trip.status === "active"
      ).length;
      const plannedTrips = userTrips.filter(
        (trip) => trip.status === "planning"
      ).length;

      const totalBudget = userTrips.reduce(
        (sum, trip) => sum + (trip.budget?.total || 0),
        0
      );
      const totalSpent = userTrips.reduce(
        (sum, trip) => sum + (trip.budget?.spent || 0),
        0
      );

      const allCountries = [
        ...new Set(
          userTrips.flatMap(
            (trip) =>
              trip.itinerary?.stops
                ?.map((stop) => stop.location.country)
                .filter(Boolean) || []
          )
        ),
      ];

      const allCities = [
        ...new Set(
          userTrips.flatMap(
            (trip) =>
              trip.itinerary?.stops
                ?.map((stop) => stop.location.city)
                .filter(Boolean) || []
          )
        ),
      ];

      const totalViews = userTrips.reduce(
        (sum, trip) => sum + (trip.views || 0),
        0
      );
      const totalLikes = userTrips.reduce(
        (sum, trip) => sum + (trip.likes || 0),
        0
      );

      // Recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentTrips = userTrips.filter(
        (trip) => new Date(trip.createdAt) >= thirtyDaysAgo
      ).length;

      const analytics = {
        overview: {
          totalTrips,
          completedTrips,
          activeTrips,
          plannedTrips,
          totalCountries: allCountries.length,
          totalCities: allCities.length,
        },
        budget: {
          totalBudget,
          totalSpent,
          remainingBudget: totalBudget - totalSpent,
          averageTripBudget: totalTrips > 0 ? totalBudget / totalTrips : 0,
        },
        engagement: {
          totalViews,
          totalLikes,
          averageViewsPerTrip: totalTrips > 0 ? totalViews / totalTrips : 0,
          averageLikesPerTrip: totalTrips > 0 ? totalLikes / totalTrips : 0,
        },
        activity: {
          recentTrips,
          lastTripDate:
            userTrips.length > 0
              ? Math.max(...userTrips.map((trip) => new Date(trip.createdAt)))
              : null,
        },
        destinations: {
          topCountries: allCountries.slice(0, 5),
          topCities: allCities.slice(0, 10),
        },
      };

      return analytics;
    } catch (error) {
      throw error;
    }
  }

  async getGlobalAnalytics() {
    try {
      const totalUsers = await User.countDocuments({ isActive: true });
      const totalTrips = await Trip.countDocuments();
      const publicTrips = await Trip.countDocuments({ isPublic: true });
      const completedTrips = await Trip.countDocuments({ status: "completed" });

      // Popular destinations
      const popularDestinations = await Trip.aggregate([
        { $match: { isPublic: true } },
        { $unwind: "$itinerary.stops" },
        {
          $group: {
            _id: {
              country: "$itinerary.stops.location.country",
            },
            count: { $sum: 1 },
            trips: { $addToSet: "$_id" },
          },
        },
        {
          $project: {
            country: "$_id.country",
            visitCount: "$count",
            tripCount: { $size: "$trips" },
          },
        },
        { $sort: { tripCount: -1 } },
        { $limit: 10 },
      ]);

      // Recent growth (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentUsers = await User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
        isActive: true,
      });

      const recentTrips = await Trip.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
      });

      return {
        overview: {
          totalUsers,
          totalTrips,
          publicTrips,
          completedTrips,
          activeUsersPercentage:
            totalUsers > 0 ? (totalUsers / totalUsers) * 100 : 0,
        },
        growth: {
          recentUsers,
          recentTrips,
          userGrowthRate: totalUsers > 0 ? (recentUsers / totalUsers) * 100 : 0,
          tripGrowthRate: totalTrips > 0 ? (recentTrips / totalTrips) * 100 : 0,
        },
        popularDestinations,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
