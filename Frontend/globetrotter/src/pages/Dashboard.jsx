import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { destinations } from "../data/destinationsData";


function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [likedDestinations, setLikedDestinations] = useState(new Set());

  const categories = [
    { name: "All", icon: "🏠" },
    { name: "Beachfront", icon: "🏖️" },
    { name: "Amazing pools", icon: "🏊" },
    { name: "Islands", icon: "🏝️" },
    { name: "Castles", icon: "🏰" },
    { name: "Historical homes", icon: "🏛️" },
    { name: "National parks", icon: "🌲" },
    { name: "Cabin", icon: "🛖" },
    { name: "Tropical", icon: "🌴" }
  ];



  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = activeCategory === "All" || dest.category === activeCategory;
    const matchesSearch = !searchQuery ||
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  const handleSearch = (e) => {
    e.preventDefault();
    // Search is now handled via live filtering in filteredDestinations
    const resultsSection = document.getElementById('popular-destinations');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const toggleLike = (id, e) => {
    e.stopPropagation();
    const newLiked = new Set(likedDestinations);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedDestinations(newLiked);
  };

  const quickSearchSuggestions = [
    "Tokyo", "Paris", "New York", "Bali", "London", "Dubai", "Rome", "Bangkok",
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg text-gray-600">Loading your adventure...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Greeting Section */}
        <section className="mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {user?.firstName || "Traveler"}! 👋
          </h1>
          <p className="text-lg text-gray-500 mt-1 font-medium">
            Explore homes and experiences tailored for your journey.
          </p>
        </section>

        {/* Categories Bar - Airbnb Style */}
        <section className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-md py-4 border-b border-gray-100 flex items-center space-x-8 overflow-x-auto no-scrollbar mb-10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center min-w-max space-y-2 transition-all group ${activeCategory === cat.name ? "text-gray-900 border-b-2 border-gray-900 pb-2" : "text-gray-500 hover:text-gray-900 border-b-2 border-transparent pb-2"
                }`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className={`text-xs font-semibold ${activeCategory === cat.name ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </section>

        {/* Keep Existing Search Section */}
        <section className="mb-16">
          <div className="relative rounded-[2rem] overflow-hidden min-h-[400px] flex items-center justify-center p-8 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
            <div
              className="absolute inset-0 z-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-indigo-900/50 z-1"></div>

            <div className="relative z-10 w-full max-w-3xl text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 drop-shadow-2xl">
                Your next journey starts here.
              </h2>

              <div className="bg-white/10 backdrop-blur-2xl border border-white/30 p-2 rounded-[2.5rem] shadow-2xl">
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <div className="absolute left-8 text-white/80">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where to? (e.g. Tokyo, Paris, Iceland...)"
                    className="w-full bg-transparent px-20 py-7 text-white placeholder-white/70 rounded-full border-0 focus:ring-0 text-xl font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 bg-white text-blue-600 px-10 py-5 rounded-[2rem] font-black hover:bg-gray-50 transition-all shadow-xl text-lg uppercase tracking-wider"
                  >
                    Search
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {quickSearchSuggestions.slice(0, 6).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSearchQuery(city)}
                    className="text-sm bg-white/20 hover:bg-white/40 text-white px-6 py-2.5 rounded-full transition-all backdrop-blur-xl border border-white/20 font-bold"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Airbnb Style Destination Grid */}
        <section id="popular-destinations" className="mb-20">

          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Popular Destinations</h2>
              <p className="text-gray-500 mt-2 font-medium">Curated collection of must-visit places around the globe.</p>
            </div>
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold text-gray-900">No destinations found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or category filters.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredDestinations.map((dest) => (

              <div
                key={dest.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/destination/${dest.id}`)}
              >

                <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <button
                    onClick={(e) => toggleLike(dest.id, e)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-all backdrop-blur-sm shadow-md"
                  >
                    {likedDestinations.has(dest.id) ? (
                      <span className="text-2xl text-red-500">❤️</span>
                    ) : (
                      <span className="text-2xl text-white">🤍</span>
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                      {dest.location}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{dest.date}</p>
                    <p className="text-sm text-gray-900 mt-1">
                      <span className="font-bold">${dest.price}</span> night
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">⭐</span>
                    <span className="text-sm font-semibold">{dest.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section - Large Card */}
        <section className="mb-12">
          <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              alt="Experience"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-12 text-white max-w-lg">
              <h2 className="text-5xl font-black mb-6 drop-shadow-lg">Discover Unique Experiences</h2>
              <p className="text-xl font-medium opacity-90 mb-8 leading-relaxed">Activities, workshops, and more organized by local experts around the world.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
