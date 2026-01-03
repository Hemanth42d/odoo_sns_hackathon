import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");


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
        {/* Greeting Section */}
        <section className="mb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {user?.firstName || "Traveler"}! 🎉
          </h1>
          <p className="text-xl text-gray-500 mt-2">
            Where would you like to go next?
          </p>
        </section>


        {/* Search Section with Map Background */}
        <section className="mb-12">
          <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center justify-center p-8 shadow-2xl">
            {/* Map Background Placeholder */}
            <div
              className="absolute inset-0 z-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-indigo-900/40 z-1"></div>

            <div className="relative z-10 w-full max-w-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
                Your next journey starts here.
              </h2>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-2xl">
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <div className="absolute left-6 text-white/70">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where to? (e.g. Tokyo, Paris, Iceland...)"
                    className="w-full bg-transparent px-16 py-6 text-white placeholder-white/60 rounded-2xl border-0 focus:ring-0 text-xl"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg text-lg"
                  >
                    Search
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {quickSearchSuggestions.slice(0, 6).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSearchQuery(city)}
                    className="text-sm bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-xl transition-all backdrop-blur-md border border-white/10"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
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


      </main>
    </div>
  );
}

export default Dashboard;
