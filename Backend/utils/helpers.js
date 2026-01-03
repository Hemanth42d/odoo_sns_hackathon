const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const calculateTripDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const calculateTotalBudget = (itinerary) => {
  if (!itinerary || !itinerary.stops) return 0;

  return itinerary.stops.reduce((total, stop) => {
    const stopBudget = stop.budget || {};
    return (
      total +
      (stopBudget.accommodation || 0) +
      (stopBudget.activities || 0) +
      (stopBudget.food || 0) +
      (stopBudget.transportation || 0) +
      (stopBudget.shopping || 0) +
      (stopBudget.other || 0)
    );
  }, 0);
};

const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (start >= end) {
    return { isValid: false, message: "Start date must be before end date" };
  }

  if (start < now) {
    return { isValid: false, message: "Start date cannot be in the past" };
  }

  return { isValid: true };
};

const generateItineraryStats = (itinerary) => {
  if (!itinerary || !itinerary.stops) {
    return {
      totalStops: 0,
      totalDays: 0,
      totalActivities: 0,
      totalBudget: 0,
      countries: [],
      cities: [],
    };
  }

  const stops = itinerary.stops;
  const countries = [
    ...new Set(stops.map((stop) => stop.location.country).filter(Boolean)),
  ];
  const cities = [
    ...new Set(stops.map((stop) => stop.location.city).filter(Boolean)),
  ];

  const totalActivities = stops.reduce((total, stop) => {
    return total + (stop.activities ? stop.activities.length : 0);
  }, 0);

  return {
    totalStops: stops.length,
    totalDays:
      calculateTripDuration(
        stops[0]?.arrivalDate,
        stops[stops.length - 1]?.departureDate
      ) || 0,
    totalActivities,
    totalBudget: calculateTotalBudget(itinerary),
    countries,
    cities,
  };
};

const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== "string") return "";

  return query
    .trim()
    .replace(/[^\w\s-]/gi, "") // Remove special characters except spaces and hyphens
    .substring(0, 100); // Limit length
};

module.exports = {
  calculateDistance,
  calculateTripDuration,
  calculateTotalBudget,
  validateDateRange,
  generateItineraryStats,
  sanitizeSearchQuery,
};
