import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    totalBudget: 0,
  });

  // Regional destinations for quick access
  const topRegions = [
    {
      name: "Europe",
      cities: ["Paris", "Amsterdam", "Berlin", "Rome"],
      image: "🏰",
      color: "from-blue-500 to-purple-600",
      description: "Historic cities & culture",
    },
    {
      name: "Southeast Asia",
      cities: ["Bangkok", "Singapore", "Ho Chi Minh", "Bali"],
      image: "🏯",
      color: "from-green-500 to-teal-600",
      description: "Tropical paradise & adventure",
    },
    {
      name: "North America",
      cities: ["New York", "San Francisco", "Toronto", "Vancouver"],
      image: "🏙️",
      color: "from-red-500 to-pink-600",
      description: "Urban exploration & nature",
    },
    {
      name: "Australia & NZ",
      cities: ["Sydney", "Melbourne", "Auckland", "Brisbane"],
      image: "🏖️",
      color: "from-orange-500 to-red-600",
      description: "Beaches & outdoor activities",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or explore page with search query
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickSearchSuggestions = [
    "Tokyo",
    "Paris",
    "New York",
    "Bali",
    "London",
    "Dubai",
    "Rome",
    "Bangkok",
  ];

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load trips data (mock data for now)
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      // Mock data for development
      const mockTrips = [
        {
          id: 1,
          name: "European Adventure 2024",
          destinations: ["Paris", "Amsterdam", "Berlin"],
          startDate: "2024-06-15",
          endDate: "2024-06-28",
          budget: 3000,
          spent: 2100,
          status: "upcoming",
        },
        {
          id: 2,
          name: "Southeast Asia Explorer",
          destinations: ["Bangkok", "Ho Chi Minh", "Siem Reap"],
          startDate: "2024-03-10",
          endDate: "2024-03-24",
          budget: 2200,
          spent: 2050,
          status: "completed",
        },
        {
          id: 3,
          name: "California Coast Road Trip",
          destinations: ["San Francisco", "Los Angeles", "San Diego"],
          startDate: "2024-08-01",
          endDate: "2024-08-10",
          budget: 2500,
          spent: 0,
          status: "planning",
        },
      ];

      setTrips(mockTrips);

      // Calculate stats
      const totalTrips = mockTrips.length;
      const upcomingTrips = mockTrips.filter(
        (trip) => trip.status === "upcoming" || trip.status === "planning"
      ).length;
      const completedTrips = mockTrips.filter(
        (trip) => trip.status === "completed"
      ).length;
      const totalBudget = mockTrips.reduce((sum, trip) => sum + trip.budget, 0);

      setStats({
        total: totalTrips,
        upcoming: upcomingTrips,
        completed: completedTrips,
        totalBudget: totalBudget,
      });
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-lg text-gray-600">Loading your trips...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <h2 className="text-2xl font-bold text-blue-600">
                  GlobeTrotter
                </h2>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link
                to="/dashboard"
                className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
              >
                Dashboard
              </Link>
              <Link
                to="/trips"
                className="text-gray-500 hover:text-gray-700 font-medium pb-1"
              >
                My Trips
              </Link>
              <Link
                to="/create-trip"
                className="text-gray-500 hover:text-gray-700 font-medium pb-1"
              >
                Create Trip
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Hello, {user?.firstName || "Traveler"}!
              </span>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Welcome Message */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 md:p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-6xl">✈️</div>
              <div className="absolute bottom-4 left-8 text-4xl">🌍</div>
              <div className="absolute top-1/2 right-1/4 text-3xl">🏖️</div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="lg:w-2/3">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Welcome back, {user?.firstName || "Traveler"}! 🎉
                  </h1>
                  <p className="text-lg md:text-xl mb-6 opacity-90">
                    Ready to discover your next adventure? Your travel dreams
                    are just a search away.
                  </p>

                  {/* Search Bar */}
                  <form onSubmit={handleSearch} className="mb-6 lg:mb-0">
                    <div className="relative max-w-md">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search cities, countries, or trips..."
                        className="w-full px-6 py-4 text-gray-900 rounded-full border-0 focus:ring-4 focus:ring-white/30 shadow-lg text-lg"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Quick Search Suggestions */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-sm opacity-75">Popular:</span>
                      {quickSearchSuggestions.slice(0, 4).map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => setSearchQuery(city)}
                          className="text-sm bg-white/20 text-white px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </form>
                </div>

                <div className="lg:w-1/3 lg:text-right">
                  <Link
                    to="/create-trip"
                    className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    <svg
                      className="w-6 h-6 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create New Trip
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Stats Dashboard */}
        <section className="mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-2xl">🧳</div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                  <p className="text-sm text-gray-600">Total Trips</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-2xl">✈️</div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.upcoming}
                  </p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-2xl">
                  ✅
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completed}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-2xl">
                  💰
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalBudget.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Budget</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Regional Selections */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Explore Popular Regions
              </h2>
              <p className="text-gray-600">
                Quick access to top destinations worldwide
              </p>
            </div>
            <Link
              to="/explore"
              className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
            >
              View All Destinations
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRegions.map((region) => (
              <div
                key={region.name}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => navigate(`/explore?region=${region.name}`)}
              >
                <div
                  className={`h-32 bg-gradient-to-br ${region.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform`}
                >
                  {region.image}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {region.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {region.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {region.cities.slice(0, 2).map((city, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {city}
                      </span>
                    ))}
                    <span className="text-xs text-gray-500">
                      +{region.cities.length - 2} more
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Trips Summary */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your Recent Trips
              </h2>
              <p className="text-gray-600">
                Continue planning or relive your adventures
              </p>
            </div>
            <Link
              to="/trips"
              className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
            >
              View All Trips
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">🌎</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start Your Travel Journey
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first trip to unlock the full GlobeTrotter
                experience!
              </p>
              <Link
                to="/create-trip"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First Trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.slice(0, 3).map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {trip.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        trip.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : trip.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Route:</p>
                    <div className="flex flex-wrap gap-1">
                      {trip.destinations.map((dest, index) => (
                        <span key={index} className="text-sm text-gray-800">
                          {dest}
                          {index < trip.destinations.length - 1 && (
                            <span className="text-gray-400 mx-1">→</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium text-gray-900">
                        ${trip.budget.toLocaleString()}
                      </span>
                    </div>
                    {trip.spent > 0 && (
                      <>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">Spent:</span>
                          <span className="font-medium text-gray-900">
                            ${trip.spent.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (trip.spent / trip.budget) * 100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/trips/${trip.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                    {trip.status !== "completed" && (
                      <Link
                        to={`/trips/${trip.id}/edit`}
                        className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Continue Planning
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Action Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/create-trip"
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-white/20 text-2xl group-hover:bg-white/30 transition-colors">
                  ✈️
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Plan New Trip</h3>
                  <p className="text-blue-100 text-sm">
                    Multi-city adventure planning
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/explore"
              className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-white/20 text-2xl group-hover:bg-white/30 transition-colors">
                  🌍
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">
                    Explore Destinations
                  </h3>
                  <p className="text-green-100 text-sm">
                    Discover amazing places
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/shared-trips"
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-white/20 text-2xl group-hover:bg-white/30 transition-colors">
                  👥
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Browse Community</h3>
                  <p className="text-purple-100 text-sm">
                    Get travel inspiration
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
