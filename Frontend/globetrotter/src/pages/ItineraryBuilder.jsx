import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";

function ItineraryBuilder() {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStop, setActiveStop] = useState(0);
  const [showAddStop, setShowAddStop] = useState(false);
  const [draggedStop, setDraggedStop] = useState(null);
  const [errors, setErrors] = useState({});

  // Initial state for a new stop
  const getNewStopTemplate = () => ({
    id: Date.now(),
    name: "",
    country: "",
    arrivalDate: "",
    departureDate: "",
    accommodation: {
      name: "",
      type: "hotel",
      pricePerNight: 0,
      nights: 0,
    },
    dailyBudget: 0,
    totalBudget: 0,
    spentBudget: 0,
    activities: [],
    notes: "",
    order: 0,
  });

  // Activity template
  const getNewActivityTemplate = (stopId, day) => ({
    id: Date.now(),
    stopId: stopId,
    day: day,
    name: "",
    category: "sightseeing",
    startTime: "09:00",
    endTime: "10:00",
    cost: 0,
    description: "",
    location: "",
    bookingRequired: false,
    notes: "",
  });

  // Load trip data
  useEffect(() => {
    if (location.state?.tripData) {
      setTrip(location.state.tripData);
      setLoading(false);
    } else {
      const trips = JSON.parse(localStorage.getItem("trips") || "[]");
      const foundTrip = trips.find((t) => t.id === tripId);

      if (foundTrip) {
        setTrip(foundTrip);
      } else {
        navigate("/dashboard");
      }
      setLoading(false);
    }
  }, [tripId, location.state, navigate]);

  // Save trip data to localStorage
  const saveTrip = (updatedTrip) => {
    const trips = JSON.parse(localStorage.getItem("trips") || "[]");
    const tripIndex = trips.findIndex((t) => t.id === updatedTrip.id);

    if (tripIndex >= 0) {
      trips[tripIndex] = updatedTrip;
    } else {
      trips.push(updatedTrip);
    }

    localStorage.setItem("trips", JSON.stringify(trips));
    setTrip(updatedTrip);
  };

  // Add new stop
  const addStop = (stopData) => {
    const newStop = {
      ...getNewStopTemplate(),
      ...stopData,
      order: trip.itinerary.stops.length,
    };

    const updatedTrip = {
      ...trip,
      itinerary: {
        ...trip.itinerary,
        stops: [...trip.itinerary.stops, newStop],
      },
    };

    saveTrip(updatedTrip);
    setShowAddStop(false);
    setActiveStop(trip.itinerary.stops.length);
  };

  // Update stop
  const updateStop = (stopIndex, stopData) => {
    const updatedStops = [...trip.itinerary.stops];
    updatedStops[stopIndex] = { ...updatedStops[stopIndex], ...stopData };

    // Recalculate total budget
    const accommodation = updatedStops[stopIndex].accommodation;
    const accommodationCost =
      accommodation.pricePerNight * accommodation.nights;
    const dailyBudget = updatedStops[stopIndex].dailyBudget;
    const days = calculateStayDuration(
      updatedStops[stopIndex].arrivalDate,
      updatedStops[stopIndex].departureDate
    );
    const activitiesCost = updatedStops[stopIndex].activities.reduce(
      (sum, activity) => sum + (activity.cost || 0),
      0
    );

    updatedStops[stopIndex].totalBudget =
      accommodationCost + dailyBudget * days + activitiesCost;

    const updatedTrip = {
      ...trip,
      itinerary: {
        ...trip.itinerary,
        stops: updatedStops,
      },
    };

    saveTrip(updatedTrip);
  };

  // Delete stop
  const deleteStop = (stopIndex) => {
    const updatedStops = trip.itinerary.stops.filter(
      (_, index) => index !== stopIndex
    );

    // Reorder remaining stops
    const reorderedStops = updatedStops.map((stop, index) => ({
      ...stop,
      order: index,
    }));

    const updatedTrip = {
      ...trip,
      itinerary: {
        ...trip.itinerary,
        stops: reorderedStops,
      },
    };

    saveTrip(updatedTrip);

    // Adjust active stop if necessary
    if (activeStop >= updatedStops.length) {
      setActiveStop(Math.max(0, updatedStops.length - 1));
    }
  };

  // Reorder stops (drag and drop)
  const reorderStops = (dragIndex, hoverIndex) => {
    const updatedStops = [...trip.itinerary.stops];
    const draggedItem = updatedStops[dragIndex];

    updatedStops.splice(dragIndex, 1);
    updatedStops.splice(hoverIndex, 0, draggedItem);

    // Update order values
    const reorderedStops = updatedStops.map((stop, index) => ({
      ...stop,
      order: index,
    }));

    const updatedTrip = {
      ...trip,
      itinerary: {
        ...trip.itinerary,
        stops: reorderedStops,
      },
    };

    saveTrip(updatedTrip);
    setActiveStop(hoverIndex);
  };

  // Add activity to stop
  const addActivity = (stopIndex, day) => {
    const newActivity = getNewActivityTemplate(
      trip.itinerary.stops[stopIndex].id,
      day
    );

    const updatedStops = [...trip.itinerary.stops];
    updatedStops[stopIndex].activities.push(newActivity);

    updateStop(stopIndex, { activities: updatedStops[stopIndex].activities });
  };

  // Update activity
  const updateActivity = (stopIndex, activityIndex, activityData) => {
    const updatedStops = [...trip.itinerary.stops];
    updatedStops[stopIndex].activities[activityIndex] = {
      ...updatedStops[stopIndex].activities[activityIndex],
      ...activityData,
    };

    updateStop(stopIndex, { activities: updatedStops[stopIndex].activities });
  };

  // Delete activity
  const deleteActivity = (stopIndex, activityIndex) => {
    const updatedStops = [...trip.itinerary.stops];
    updatedStops[stopIndex].activities.splice(activityIndex, 1);

    updateStop(stopIndex, { activities: updatedStops[stopIndex].activities });
  };

  // Calculate stay duration
  const calculateStayDuration = (arrivalDate, departureDate) => {
    if (!arrivalDate || !departureDate) return 0;
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    const diffTime = Math.abs(departure - arrival);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get activities for specific day
  const getActivitiesForDay = (stopIndex, day) => {
    return trip.itinerary.stops[stopIndex].activities.filter(
      (activity) => activity.day === day
    );
  };

  // Get total trip budget
  const getTotalTripBudget = () => {
    return trip.itinerary.stops.reduce(
      (sum, stop) => sum + stop.totalBudget,
      0
    );
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedStop(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedStop !== null && draggedStop !== dropIndex) {
      reorderStops(draggedStop, dropIndex);
    }
    setDraggedStop(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Trip not found</h2>
          <Link
            to="/dashboard"
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentStop = trip.itinerary.stops[activeStop];
  const stayDuration = currentStop
    ? calculateStayDuration(currentStop.arrivalDate, currentStop.departureDate)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/trip/${tripId}/plan`}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Trip
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Itinerary Builder
                </h1>
                <p className="text-gray-600">{trip.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right text-sm">
                <div className="text-gray-600">Total Budget</div>
                <div className="font-bold text-lg text-green-600">
                  ${getTotalTripBudget().toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setShowAddStop(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2"
              >
                <span>+</span>
                <span>Add Stop</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Trip Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trip Overview
              </h3>

              {/* Route Timeline */}
              <div className="space-y-3 mb-6">
                {trip.itinerary.stops.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-3xl mb-2">🗺️</div>
                    <div className="text-sm">No stops yet</div>
                    <button
                      onClick={() => setShowAddStop(true)}
                      className="mt-2 text-blue-600 text-sm hover:text-blue-700"
                    >
                      Add your first stop
                    </button>
                  </div>
                ) : (
                  trip.itinerary.stops.map((stop, index) => (
                    <div
                      key={stop.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onClick={() => setActiveStop(index)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        activeStop === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      } ${draggedStop === index ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <div className="font-medium text-gray-900">
                              {stop.name || "Unnamed City"}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1 ml-8">
                            {stop.arrivalDate && stop.departureDate
                              ? `${new Date(
                                  stop.arrivalDate
                                ).toLocaleDateString()} - ${new Date(
                                  stop.departureDate
                                ).toLocaleDateString()}`
                              : "Dates not set"}
                          </div>
                          <div className="text-xs text-green-600 mt-1 ml-8 font-medium">
                            ${stop.totalBudget.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs">⋮⋮</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Budget Summary */}
              {trip.itinerary.stops.length > 0 && (
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Budget Summary
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Budget:</span>
                      <span className="font-medium text-green-600">
                        ${getTotalTripBudget().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Per Day Avg:</span>
                      <span className="font-medium">
                        $
                        {trip.itinerary.stops.length > 0
                          ? Math.round(
                              getTotalTripBudget() /
                                Math.max(
                                  1,
                                  trip.itinerary.stops.reduce(
                                    (sum, stop) =>
                                      sum +
                                      calculateStayDuration(
                                        stop.arrivalDate,
                                        stop.departureDate
                                      ),
                                    0
                                  )
                                )
                            )
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {trip.itinerary.stops.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-6">🗺️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Start Building Your Itinerary
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Add your first destination to begin planning your multi-city
                  adventure. Each stop can include accommodation, daily
                  activities, and budget tracking.
                </p>
                <button
                  onClick={() => setShowAddStop(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 text-lg"
                >
                  Add Your First Stop
                </button>
              </div>
            ) : (
              /* Stop Details */
              <div className="space-y-6">
                {/* Stop Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Stop {activeStop + 1}:{" "}
                          {currentStop.name || "Unnamed City"}
                        </h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {stayDuration} {stayDuration === 1 ? "day" : "days"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block text-gray-600 mb-1">
                            City Name *
                          </label>
                          <input
                            type="text"
                            value={currentStop.name}
                            onChange={(e) =>
                              updateStop(activeStop, { name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter city name"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            value={currentStop.country}
                            onChange={(e) =>
                              updateStop(activeStop, {
                                country: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter country"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteStop(activeStop)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Delete Stop"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-600 mb-1">
                        Arrival Date *
                      </label>
                      <input
                        type="date"
                        value={currentStop.arrivalDate}
                        onChange={(e) =>
                          updateStop(activeStop, {
                            arrivalDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">
                        Departure Date *
                      </label>
                      <input
                        type="date"
                        value={currentStop.departureDate}
                        onChange={(e) =>
                          updateStop(activeStop, {
                            departureDate: e.target.value,
                          })
                        }
                        min={currentStop.arrivalDate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Budget Overview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        Budget for this stop
                      </h4>
                      <div className="text-xl font-bold text-green-600">
                        ${currentStop.totalBudget.toLocaleString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Daily Budget
                        </label>
                        <input
                          type="number"
                          value={currentStop.dailyBudget}
                          onChange={(e) =>
                            updateStop(activeStop, {
                              dailyBudget: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Per day"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Accommodation
                        </label>
                        <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                          $
                          {(
                            currentStop.accommodation.pricePerNight *
                            currentStop.accommodation.nights
                          ).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Activities
                        </label>
                        <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                          $
                          {currentStop.activities
                            .reduce(
                              (sum, activity) => sum + (activity.cost || 0),
                              0
                            )
                            .toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accommodation Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <span>🏨</span>
                    <span>Accommodation</span>
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1">
                        Hotel/Place Name
                      </label>
                      <input
                        type="text"
                        value={currentStop.accommodation.name}
                        onChange={(e) =>
                          updateStop(activeStop, {
                            accommodation: {
                              ...currentStop.accommodation,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Hotel name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Type</label>
                      <select
                        value={currentStop.accommodation.type}
                        onChange={(e) =>
                          updateStop(activeStop, {
                            accommodation: {
                              ...currentStop.accommodation,
                              type: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="hotel">Hotel</option>
                        <option value="hostel">Hostel</option>
                        <option value="airbnb">Airbnb</option>
                        <option value="guesthouse">Guest House</option>
                        <option value="resort">Resort</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">
                        Price per Night
                      </label>
                      <input
                        type="number"
                        value={currentStop.accommodation.pricePerNight}
                        onChange={(e) => {
                          const pricePerNight = parseFloat(e.target.value) || 0;
                          updateStop(activeStop, {
                            accommodation: {
                              ...currentStop.accommodation,
                              pricePerNight,
                              nights: stayDuration,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Price"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">
                        Nights ({stayDuration})
                      </label>
                      <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                        Total: $
                        {(
                          currentStop.accommodation.pricePerNight * stayDuration
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activities Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <span>🎯</span>
                      <span>Daily Activities</span>
                    </h3>
                  </div>

                  {stayDuration > 0 ? (
                    <div className="space-y-6">
                      {Array.from({ length: stayDuration }, (_, dayIndex) => {
                        const dayNumber = dayIndex + 1;
                        const dayActivities = getActivitiesForDay(
                          activeStop,
                          dayNumber
                        );
                        const dayDate = new Date(currentStop.arrivalDate);
                        dayDate.setDate(dayDate.getDate() + dayIndex);

                        return (
                          <div
                            key={dayNumber}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                  {dayNumber}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    Day {dayNumber}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {dayDate.toLocaleDateString("en-US", {
                                      weekday: "long",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  addActivity(activeStop, dayNumber)
                                }
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                              >
                                + Add Activity
                              </button>
                            </div>

                            {dayActivities.length === 0 ? (
                              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                <div className="text-2xl mb-2">📅</div>
                                <div className="text-sm">
                                  No activities planned
                                </div>
                                <button
                                  onClick={() =>
                                    addActivity(activeStop, dayNumber)
                                  }
                                  className="mt-2 text-blue-600 text-sm hover:text-blue-700"
                                >
                                  Add your first activity
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {dayActivities
                                  .sort((a, b) =>
                                    a.startTime.localeCompare(b.startTime)
                                  )
                                  .map((activity, activityIndex) => {
                                    const globalActivityIndex =
                                      currentStop.activities.findIndex(
                                        (a) => a.id === activity.id
                                      );
                                    return (
                                      <div
                                        key={activity.id}
                                        className="bg-gray-50 rounded-lg p-3"
                                      >
                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                                          <div>
                                            <label className="block text-xs text-gray-600 mb-1">
                                              Activity Name
                                            </label>
                                            <input
                                              type="text"
                                              value={activity.name}
                                              onChange={(e) =>
                                                updateActivity(
                                                  activeStop,
                                                  globalActivityIndex,
                                                  { name: e.target.value }
                                                )
                                              }
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                              placeholder="Activity name"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-600 mb-1">
                                              Time
                                            </label>
                                            <div className="flex items-center space-x-1">
                                              <input
                                                type="time"
                                                value={activity.startTime}
                                                onChange={(e) =>
                                                  updateActivity(
                                                    activeStop,
                                                    globalActivityIndex,
                                                    {
                                                      startTime: e.target.value,
                                                    }
                                                  )
                                                }
                                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                              />
                                              <span className="text-gray-400">
                                                -
                                              </span>
                                              <input
                                                type="time"
                                                value={activity.endTime}
                                                onChange={(e) =>
                                                  updateActivity(
                                                    activeStop,
                                                    globalActivityIndex,
                                                    { endTime: e.target.value }
                                                  )
                                                }
                                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                              />
                                            </div>
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-600 mb-1">
                                              Category
                                            </label>
                                            <select
                                              value={activity.category}
                                              onChange={(e) =>
                                                updateActivity(
                                                  activeStop,
                                                  globalActivityIndex,
                                                  { category: e.target.value }
                                                )
                                              }
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                              <option value="sightseeing">
                                                🏛️ Sightseeing
                                              </option>
                                              <option value="food">
                                                🍽️ Food & Dining
                                              </option>
                                              <option value="adventure">
                                                🏔️ Adventure
                                              </option>
                                              <option value="culture">
                                                🎭 Culture
                                              </option>
                                              <option value="shopping">
                                                🛍️ Shopping
                                              </option>
                                              <option value="relaxation">
                                                🧘 Relaxation
                                              </option>
                                              <option value="transport">
                                                🚗 Transportation
                                              </option>
                                              <option value="other">
                                                📝 Other
                                              </option>
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-600 mb-1">
                                              Cost ($)
                                            </label>
                                            <input
                                              type="number"
                                              value={activity.cost}
                                              onChange={(e) =>
                                                updateActivity(
                                                  activeStop,
                                                  globalActivityIndex,
                                                  {
                                                    cost:
                                                      parseFloat(
                                                        e.target.value
                                                      ) || 0,
                                                  }
                                                )
                                              }
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                              placeholder="Cost"
                                            />
                                          </div>
                                          <div className="flex items-end">
                                            <button
                                              onClick={() =>
                                                deleteActivity(
                                                  activeStop,
                                                  globalActivityIndex
                                                )
                                              }
                                              className="text-red-600 hover:text-red-700 p-1"
                                              title="Delete Activity"
                                            >
                                              🗑️
                                            </button>
                                          </div>
                                        </div>

                                        {/* Activity Details (Collapsible) */}
                                        <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs text-gray-600 mb-1">
                                              Location/Address
                                            </label>
                                            <input
                                              type="text"
                                              value={activity.location}
                                              onChange={(e) =>
                                                updateActivity(
                                                  activeStop,
                                                  globalActivityIndex,
                                                  { location: e.target.value }
                                                )
                                              }
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                              placeholder="Location"
                                            />
                                          </div>
                                          <div className="flex items-center space-x-3">
                                            <label className="flex items-center space-x-2">
                                              <input
                                                type="checkbox"
                                                checked={
                                                  activity.bookingRequired
                                                }
                                                onChange={(e) =>
                                                  updateActivity(
                                                    activeStop,
                                                    globalActivityIndex,
                                                    {
                                                      bookingRequired:
                                                        e.target.checked,
                                                    }
                                                  )
                                                }
                                                className="rounded"
                                              />
                                              <span className="text-xs text-gray-600">
                                                Booking Required
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-3xl mb-2">📅</div>
                      <div>
                        Set arrival and departure dates to plan daily activities
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Stop Modal */}
      {showAddStop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Stop
            </h3>
            <AddStopForm
              onSubmit={addStop}
              onCancel={() => setShowAddStop(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Add Stop Form Component
function AddStopForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    arrivalDate: "",
    departureDate: "",
    dailyBudget: 100,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "City name is required";
    }
    if (!formData.arrivalDate) {
      newErrors.arrivalDate = "Arrival date is required";
    }
    if (!formData.departureDate) {
      newErrors.departureDate = "Departure date is required";
    }
    if (
      formData.arrivalDate &&
      formData.departureDate &&
      new Date(formData.departureDate) <= new Date(formData.arrivalDate)
    ) {
      newErrors.departureDate = "Departure must be after arrival";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">City Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter city name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Country</label>
        <input
          type="text"
          value={formData.country}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter country (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-2">Arrival Date *</label>
          <input
            type="date"
            value={formData.arrivalDate}
            onChange={(e) =>
              setFormData({ ...formData, arrivalDate: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.arrivalDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.arrivalDate && (
            <p className="text-red-500 text-sm mt-1">{errors.arrivalDate}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Departure Date *</label>
          <input
            type="date"
            value={formData.departureDate}
            onChange={(e) =>
              setFormData({ ...formData, departureDate: e.target.value })
            }
            min={formData.arrivalDate}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.departureDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.departureDate && (
            <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Daily Budget ($)</label>
        <input
          type="number"
          value={formData.dailyBudget}
          onChange={(e) =>
            setFormData({
              ...formData,
              dailyBudget: parseFloat(e.target.value) || 0,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Daily spending budget"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Stop
        </button>
      </div>
    </form>
  );
}

export default ItineraryBuilder;
