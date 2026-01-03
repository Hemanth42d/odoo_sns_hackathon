import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";

function TripPlanning() {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Load trip data
    if (location.state?.tripData) {
      // New trip from create flow
      setTrip(location.state.tripData);
      setLoading(false);
    } else {
      // Load existing trip from localStorage
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip details...</p>
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

  const tabs = [
    { id: "overview", name: "Overview", icon: "📋" },
    { id: "destinations", name: "Destinations", icon: "📍" },
    { id: "accommodations", name: "Hotels", icon: "🏨" },
    { id: "activities", name: "Activities", icon: "🎯" },
    { id: "budget", name: "Budget", icon: "💰" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {trip.name}
                </h1>
                <p className="text-gray-600">
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {trip.status}
              </span>
              <Link
                to={`/trip/${tripId}/itinerary`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
              >
                Build Itinerary
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                Share Trip
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* New Trip Welcome Message */}
        {location.state?.newTrip && (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              🎉 Trip Created Successfully!
            </h2>
            <p className="text-blue-100 mb-4">
              Your trip "{trip.name}" has been created. Now let's start planning
              the details!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Next Steps:</div>
                <div>• Add destinations</div>
                <div>• Find accommodations</div>
                <div>• Plan activities</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">AI Suggestions:</div>
                <div>• Smart recommendations</div>
                <div>• Budget optimization</div>
                <div>• Local insights</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Collaboration:</div>
                <div>• Invite travel partners</div>
                <div>• Share itinerary</div>
                <div>• Real-time updates</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Trip Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {trip.duration}
                </div>
                <div className="text-gray-600">Days</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {trip.numberOfTravelers}
                </div>
                <div className="text-gray-600">Travelers</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">
                  {trip.destinations.length}
                </div>
                <div className="text-gray-600">Destinations</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">
                  {trip.budgetTracking.totalBudget
                    ? `$${trip.budgetTracking.totalBudget.toLocaleString()}`
                    : "TBD"}
                </div>
                <div className="text-gray-600">Budget</div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Getting Started
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to={`/trip/${tripId}/itinerary`}
                  className="text-left p-4 border-2 border-blue-500 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="text-2xl mb-2">🗺️</div>
                  <div className="font-medium text-blue-900">
                    Build Itinerary
                  </div>
                  <div className="text-sm text-blue-700">
                    Multi-city trip planning
                  </div>
                </Link>

                <button
                  onClick={() => setActiveTab("destinations")}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-2xl mb-2">📍</div>
                  <div className="font-medium text-gray-900">
                    Add Destinations
                  </div>
                  <div className="text-sm text-gray-600">
                    Plan your route and stops
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("accommodations")}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-2xl mb-2">🏨</div>
                  <div className="font-medium text-gray-900">Find Hotels</div>
                  <div className="text-sm text-gray-600">
                    Book accommodations
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("activities")}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-medium text-gray-900">
                    Plan Activities
                  </div>
                  <div className="text-sm text-gray-600">
                    Discover experiences
                  </div>
                </button>
              </div>
            </div>

            {/* Trip Timeline */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trip Timeline
              </h3>
              <div className="space-y-4">
                {trip.destinations.length > 0 ? (
                  trip.destinations.map((dest, index) => (
                    <div key={dest.id} className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {dest.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(dest.arrivalDate).toLocaleDateString()} -{" "}
                          {new Date(dest.departureDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">🗺️</div>
                    <div className="text-lg font-medium">
                      No destinations yet
                    </div>
                    <div className="text-sm">
                      Start by adding your first destination
                    </div>
                    <button
                      onClick={() => setActiveTab("destinations")}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                      Add Destination
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other tab content placeholders */}
        {activeTab !== "overview" && (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600 mb-4">
              This section is under development for the hackathon demo.
            </p>
            <button
              onClick={() => setActiveTab("overview")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Back to Overview
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default TripPlanning;
