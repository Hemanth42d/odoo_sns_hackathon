const Trip = require("../Models/Trip");
const User = require("../Models/User");
const { sanitizeSearchQuery } = require("../utils/helpers");

class SearchService {
  async searchTrips(query, filters = {}, userId = null) {
    const sanitizedQuery = sanitizeSearchQuery(query);

    if (!sanitizedQuery) {
      return { trips: [], total: 0 };
    }

    // Build search criteria
    const searchCriteria = {
      $and: [
        // Text search
        {
          $or: [
            { name: { $regex: sanitizedQuery, $options: "i" } },
            { description: { $regex: sanitizedQuery, $options: "i" } },
            {
              "itinerary.stops.location.city": {
                $regex: sanitizedQuery,
                $options: "i",
              },
            },
            {
              "itinerary.stops.location.country": {
                $regex: sanitizedQuery,
                $options: "i",
              },
            },
            { theme: { $regex: sanitizedQuery, $options: "i" } },
          ],
        },
        // Public trips or user's own trips
        {
          $or: [
            { isPublic: true },
            ...(userId
              ? [{ owner: userId }, { "collaborators.user": userId }]
              : []),
          ],
        },
      ],
    };

    // Apply filters
    if (filters.theme) {
      searchCriteria.$and.push({ theme: filters.theme });
    }

    if (filters.status) {
      searchCriteria.$and.push({ status: filters.status });
    }

    if (filters.country) {
      searchCriteria.$and.push({
        "itinerary.stops.location.country": {
          $regex: filters.country,
          $options: "i",
        },
      });
    }

    if (filters.minBudget || filters.maxBudget) {
      const budgetCriteria = {};
      if (filters.minBudget)
        budgetCriteria.$gte = parseFloat(filters.minBudget);
      if (filters.maxBudget)
        budgetCriteria.$lte = parseFloat(filters.maxBudget);
      searchCriteria.$and.push({ "budget.total": budgetCriteria });
    }

    if (filters.startDate) {
      searchCriteria.$and.push({
        startDate: { $gte: new Date(filters.startDate) },
      });
    }

    if (filters.endDate) {
      searchCriteria.$and.push({
        endDate: { $lte: new Date(filters.endDate) },
      });
    }

    // Execute search
    const limit = Math.min(parseInt(filters.limit) || 20, 50);
    const offset = parseInt(filters.offset) || 0;
    const sortBy = filters.sortBy || "relevance";

    let sortCriteria = { createdAt: -1 }; // default sort

    switch (sortBy) {
      case "date":
        sortCriteria = { startDate: 1 };
        break;
      case "budget":
        sortCriteria = { "budget.total": 1 };
        break;
      case "popularity":
        sortCriteria = { views: -1, likes: -1 };
        break;
      case "name":
        sortCriteria = { name: 1 };
        break;
    }

    const [trips, total] = await Promise.all([
      Trip.find(searchCriteria)
        .populate("owner", "firstName lastName profilePicture")
        .select("-collaborators -budget.breakdown")
        .sort(sortCriteria)
        .limit(limit)
        .skip(offset),
      Trip.countDocuments(searchCriteria),
    ]);

    return { trips, total };
  }

  async searchUsers(query, filters = {}) {
    const sanitizedQuery = sanitizeSearchQuery(query);

    if (!sanitizedQuery) {
      return { users: [], total: 0 };
    }

    const searchCriteria = {
      $and: [
        {
          $or: [
            { firstName: { $regex: sanitizedQuery, $options: "i" } },
            { lastName: { $regex: sanitizedQuery, $options: "i" } },
            { email: { $regex: sanitizedQuery, $options: "i" } },
          ],
        },
        { isActive: true },
      ],
    };

    const limit = Math.min(parseInt(filters.limit) || 10, 20);
    const offset = parseInt(filters.offset) || 0;

    const [users, total] = await Promise.all([
      User.find(searchCriteria)
        .select("firstName lastName email profilePicture statistics")
        .limit(limit)
        .skip(offset),
      User.countDocuments(searchCriteria),
    ]);

    return { users, total };
  }

  async getPopularDestinations(limit = 10) {
    const destinations = await Trip.aggregate([
      { $match: { isPublic: true } },
      { $unwind: "$itinerary.stops" },
      {
        $group: {
          _id: {
            city: "$itinerary.stops.location.city",
            country: "$itinerary.stops.location.country",
          },
          count: { $sum: 1 },
          trips: { $addToSet: "$_id" },
        },
      },
      {
        $project: {
          city: "$_id.city",
          country: "$_id.country",
          tripCount: { $size: "$trips" },
          visitCount: "$count",
        },
      },
      { $sort: { tripCount: -1, visitCount: -1 } },
      { $limit: limit },
    ]);

    return destinations;
  }

  async getSuggestions(query) {
    const sanitizedQuery = sanitizeSearchQuery(query);

    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      return [];
    }

    // Get city/country suggestions
    const locationSuggestions = await Trip.aggregate([
      { $match: { isPublic: true } },
      { $unwind: "$itinerary.stops" },
      {
        $match: {
          $or: [
            {
              "itinerary.stops.location.city": {
                $regex: sanitizedQuery,
                $options: "i",
              },
            },
            {
              "itinerary.stops.location.country": {
                $regex: sanitizedQuery,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            city: "$itinerary.stops.location.city",
            country: "$itinerary.stops.location.country",
          },
        },
      },
      {
        $project: {
          suggestion: {
            $concat: ["$_id.city", ", ", "$_id.country"],
          },
          type: "location",
        },
      },
      { $limit: 5 },
    ]);

    // Get trip name suggestions
    const tripSuggestions = await Trip.find({
      name: { $regex: sanitizedQuery, $options: "i" },
      isPublic: true,
    })
      .select("name")
      .limit(3)
      .then((trips) =>
        trips.map((trip) => ({
          suggestion: trip.name,
          type: "trip",
        }))
      );

    return [...locationSuggestions, ...tripSuggestions];
  }
}

module.exports = new SearchService();
