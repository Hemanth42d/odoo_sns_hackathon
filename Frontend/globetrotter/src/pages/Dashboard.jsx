import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickSearchSuggestions = [
    "Tokyo", "Paris", "New York", "Bali", "London", "Dubai", "Rome", "Bangkok",
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
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
      const totalTrips = mockTrips.length;
      const upcomingTrips = mockTrips.filter(t => t.status === "upcoming" || t.status === "planning").length;
      const completedTrips = mockTrips.filter(t => t.status === "completed").length;
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
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg text-gray-600">Loading your trips...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-blue-100">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-6xl">✈️</div>
              <div className="absolute bottom-4 left-8 text-4xl">🌍</div>
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="lg:w-2/3">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                  Welcome back, {user?.firstName || "Traveler"}! 🎉
                </h1>
                <p className="text-xl mb-8 opacity-90 leading-relaxed">
                  Ready to discover your next adventure? Your travel dreams are just a search away.
                </p>
                <form onSubmit={handleSearch} className="relative max-w-xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cities, countries, or trips..."
                    className="w-full px-8 py-5 text-gray-900 rounded-2xl border-0 focus:ring-4 focus:ring-white/30 shadow-2xl text-lg pr-16"
                  />
                  <button type="submit" className="absolute right-3 top-3 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {quickSearchSuggestions.slice(0, 4).map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setSearchQuery(city)}
                        className="text-sm bg-white/20 text-white px-4 py-1.5 rounded-full hover:bg-white/30 transition-colors backdrop-blur-md"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions (Moved to top) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Quick Actions</h2>
            <div className="h-px flex-1 bg-gray-200 mx-8 hidden md:block"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/create-trip" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all transform hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">✈️</div>
              <h3 className="text-lg font-bold text-gray-900">Plan New Trip</h3>
              <p className="text-gray-500 text-sm mt-1">Multi-city adventure planning</p>
            </Link>
            <Link to="/explore" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all transform hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🌍</div>
              <h3 className="text-lg font-bold text-gray-900">Explore</h3>
              <p className="text-gray-500 text-sm mt-1">Discover amazing places</p>
            </Link>
            <Link to="/community" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all transform hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">👥</div>
              <h3 className="text-lg font-bold text-gray-900">Community</h3>
              <p className="text-gray-500 text-sm mt-1">Get travel inspiration</p>
            </Link>
            <Link to="/profile" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all transform hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
              <h3 className="text-lg font-bold text-gray-900">Settings</h3>
              <p className="text-gray-500 text-sm mt-1">Manage your account</p>
            </Link>
          </div>
        </section>

        {/* Travel Stats */}
        <section className="mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Trips", count: stats.total, icon: "🧳", color: "bg-blue-50 text-blue-600" },
              { label: "Upcoming", count: stats.upcoming, icon: "✈️", color: "bg-emerald-50 text-emerald-600" },
              { label: "Completed", count: stats.completed, icon: "✅", color: "bg-purple-50 text-purple-600" },
              { label: "Budget", count: `$${stats.totalBudget.toLocaleString()}`, icon: "💰", color: "bg-amber-50 text-amber-600" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white px-6 py-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>{stat.icon}</div>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Regions */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Explore Popular Regions</h2>
            <Link to="/explore" className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1 group">
              View All <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRegions.map((region) => (
              <div
                key={region.name}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => navigate(`/explore?region=${region.name}`)}
              >
                <div className={`h-36 bg-gradient-to-br ${region.color} flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500`}>
                  {region.image}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{region.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{region.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {region.cities.slice(0, 2).map((city, i) => (
                      <span key={i} className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-100">{city}</span>
                    ))}
                    <span className="text-xs text-gray-400 self-center">+{region.cities.length - 2} more</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Trips */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Recent Trips</h2>
            <Link to="/trips" className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1 group">
              View All Trips <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
              <div className="text-7xl mb-6">🌎</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Travel Journey</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Create your first trip to unlock the full GlobeTrotter experience!</p>
              <Link to="/create-trip" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all inline-flex items-center shadow-lg shadow-blue-100">
                <span className="mr-2">+</span> Create First Trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.slice(0, 3).map((trip) => (
                <div key={trip.id} className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{trip.name}</h3>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${trip.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                          trip.status === "upcoming" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                        }`}>
                        {trip.status}
                      </span>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">Route</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {trip.destinations.map((dest, i) => (
                          <span key={i} className="flex items-center text-sm font-medium text-gray-700">
                            {dest}{i < trip.destinations.length - 1 && <span className="mx-2 text-gray-300">→</span>}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 mb-8">
                      <div className="flex justify-between text-sm mb-4">
                        <span className="text-gray-500 font-medium">Budget Tracking</span>
                        <span className="font-bold text-gray-900">${trip.spent.toLocaleString()} / ${trip.budget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((trip.spent / trip.budget) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Link to={`/trips/${trip.id}`} className="flex-1 bg-gray-900 text-white text-center py-4 rounded-xl text-sm font-bold hover:bg-black transition-all">Details</Link>
                      {trip.status !== "completed" && (
                        <Link to={`/trips/${trip.id}/edit`} className="flex-1 bg-blue-50 text-blue-600 text-center py-4 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all border border-blue-100">Plan</Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
