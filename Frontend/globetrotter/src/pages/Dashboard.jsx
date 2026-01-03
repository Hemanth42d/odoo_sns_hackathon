import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function CalendarView({ trips, mockItineraryData }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[month];

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  // Helper to check if a trip exists on a date
  const getTripForDate = (day) => {
    if (!day) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const checkDate = new Date(year, month, day);

    return trips.find(trip => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      // Set to midnight for comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= start && checkDate <= end;
    });
  };

  // Helper to check if activities exist on a date
  const getActivitiesForDate = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = mockItineraryData.days.find(d => d.date === dateStr);
    return dayData ? dayData.activities : [];
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">📅</span> {monthName} {year}
          </h3>
          <p className="text-sm text-gray-500 font-medium">Your Travel Timeline</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl border border-gray-200 transition-all shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl border border-gray-200 transition-all shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
          {days.map((day, idx) => {
            const trip = getTripForDate(day);
            const activities = getActivitiesForDate(day);
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

            return (
              <div key={idx} className={`min-h-[100px] bg-white p-3 relative group transition-all duration-300 ${!day ? 'bg-gray-50/50' : 'hover:z-10 hover:shadow-2xl hover:scale-[1.02] cursor-default'}`}>
                {day && (
                  <>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-bold ${trip ? 'text-blue-600' : isToday ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-900 border-b-2 border-transparent group-hover:border-blue-200'}`}>{day}</span>
                      {isToday && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.7)]"></span>}
                    </div>
                    {trip && (
                      <div className="mt-1 transform transition-transform group-hover:translate-x-1">
                        <div className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-bold truncate border border-blue-100 shadow-sm">
                          {trip.name}
                        </div>
                      </div>
                    )}
                    {activities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {activities.map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] hover:scale-125 transition-transform" title="Activity planned"></div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <div className="flex items-center"><div className="w-3 h-3 rounded bg-blue-50 border border-blue-200 mr-2"></div> Active Trip</div>
          <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div> Activities</div>
          <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div> Today</div>
        </div>
        <div className="text-xs font-medium text-blue-600 cursor-pointer hover:underline">View Full Timeline →</div>
      </div>
    </div>
  );
}

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

  const [activePreview, setActivePreview] = useState(null);

  const sharedTrips = [
    {
      id: 101,
      name: "Icelandic Ring Road Adventure",
      author: "Alex Traveler",
      destinations: ["Reykjavik", "Vik", "Akureyri"],
      duration: "10 Days",
      rating: 4.9,
      copiedCount: 154,
      image: "🏔️",
      tags: ["Nature", "Road Trip", "Adventure"],
      summary: "A complete circle around the island of fire and ice. Perfect for photography lovers.",
      budget: "$2,500",
      bestTime: "June - August"
    },
    {
      id: 102,
      name: "Culinary Tour of Kyoto",
      author: "FoodieJpn",
      destinations: ["Kyoto", "Arashiyama", "Uji"],
      duration: "5 Days",
      rating: 4.8,
      copiedCount: 89,
      image: "🍱",
      tags: ["Food", "Culture", "Relaxation"],
      summary: "Discover the hidden gems of Kyoto's food scene, from street food to kaiseki.",
      budget: "$1,200",
      bestTime: "April or November"
    },
    {
      id: 103,
      name: "Greek Island Hopping",
      author: "SeaLover",
      destinations: ["Athens", "Santorini", "Mykonos"],
      duration: "7 Days",
      rating: 4.7,
      copiedCount: 210,
      image: "🏖️",
      tags: ["Beach", "Luxury", "History"],
      summary: "The ultimate blue and white vacation. Best visited in early September.",
      budget: "$1,800",
      bestTime: "May - September"
    }
  ];

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

  const mockItineraryData = {
    tripName: "Swiss Alps Adventure",
    totalDays: 3,
    overallTotal: 1250,
    days: [
      {
        day: 1,
        date: "2024-07-10",
        activities: [
          { name: "Arrival & Hotel Check-in", cost: 150, category: "Logistics" },
          { name: "Lake Zurich Cruise", cost: 25, category: "Sightseeing" },
          { name: "Dinner at Swiss Chuchi", cost: 60, category: "Dining" },
        ],
        dailyTotal: 235,
      },
      {
        day: 2,
        date: "2024-07-11",
        activities: [
          { name: "Train to Interlaken", cost: 45, category: "Transport" },
          { name: "Paragliding over Alps", cost: 180, category: "Adventure" },
          { name: "Harder Kulm Sunset", cost: 35, category: "Sightseeing" },
        ],
        dailyTotal: 260,
      },
      {
        day: 3,
        date: "2024-07-12",
        activities: [
          { name: "Jungfraujoch Top of Europe", cost: 210, category: "Sightseeing" },
          { name: "Chocolate Workshop", cost: 40, category: "Experience" },
          { name: "Farewell Dinner", cost: 75, category: "Dining" },
        ],
        dailyTotal: 325,
      }
    ]
  };

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
              <Link
                to="/profile"
                className="text-gray-500 hover:text-gray-700 font-medium pb-1"
              >
                Profile
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                Hello, {user?.firstName || "Traveler"}!
              </Link>
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

        {/* Global Timeline / Calendar View Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                GlobeTrotter Timeline
              </h2>
              <p className="text-gray-600">
                Visualize your past and future adventures across the calendar
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
              <span className="text-blue-600 font-bold">Smart Calendar</span>
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Pro</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <CalendarView trips={trips} mockItineraryData={mockItineraryData} />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm h-full flex flex-col justify-center bg-gradient-to-b from-white to-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">🚀</span> Why Travel Calendar?
                </h3>

                <div className="space-y-8">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      Improved Trip Visualization
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed pl-3.5">
                      Lists show you <i>what</i> you're doing, but calendars show you <i>how</i> your time flows. See gaps between trips, identify overlapping schedules, and visualize the duration of your journeys at a glance.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                      Connected Data Intelligence
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed pl-3.5">
                      The calendar isn't just a view—it's an anchor. Each date connects directly to your daily itinerary and budget, allowing you to see exactly where your money goes across the entire trip timeline.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                      Better than Lists
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed pl-3.5">
                      Unlike static lists, the calendar provides temporal context. It helps you prepare for upcoming departures by showing exactly how many days are left, and makes relive-ing past trips more intuitive through chronology.
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col space-y-3">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-center cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1">
                    <p className="text-[10px] text-white font-bold uppercase tracking-widest">
                      Sync with Google Calendar
                    </p>
                  </div>
                  <p className="text-[10px] text-center text-gray-400 font-medium italic">"Time is the currency of travel."</p>
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
                      className={`px-3 py-1 rounded-full text-xs font-medium ${trip.status === "completed"
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

        {/* Interactive Itinerary & Budget Breakdown */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Itinerary View & Budget Breakdown
              </h2>
              <p className="text-gray-600">
                Detailed daily plan with integrated expense tracking for your current trip
              </p>
            </div>
            <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 flex items-center shadow-sm">
              <div className="mr-4 p-2 bg-blue-600 rounded-lg text-white">💰</div>
              <div>
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Estimated Trip Total</p>
                <p className="text-xl font-bold text-blue-900">${mockItineraryData.days.reduce((acc, curr) => acc + curr.dailyTotal, 0)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itinerary Column */}
            <div className="lg:col-span-2 space-y-6">
              {mockItineraryData.days.map((day) => (
                <div key={day.day} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md shadow-blue-200">
                        {day.day}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Day {day.day}</h3>
                        <p className="text-sm text-gray-500">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Daily Spending</p>
                      <p className="text-xl font-bold text-gray-900">${day.dailyTotal}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {day.activities.map((activity, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                              {activity.category === 'Dining' ? '🍽️' :
                                activity.category === 'Sightseeing' ? '🏛️' :
                                  activity.category === 'Transport' ? '🚂' :
                                    activity.category === 'Adventure' ? '⛰️' :
                                      activity.category === 'Logistics' ? '🏨' : '📍'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{activity.name}</p>
                              <p className="text-xs font-medium text-blue-600 px-2 py-0.5 bg-blue-50 rounded-full inline-block">{activity.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 text-lg">${activity.cost}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Insights / Explanation Column */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-2">💡</span> Budget Insights
                  </h3>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        How budget calculations work
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed pl-3.5">
                        Our system automatically aggregates costs from three sources: fixed accommodations, scheduled activities, and a dynamic daily allowance. This provides a granular view of where every dollar is allocated.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                        How users stay within budget
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed pl-3.5">
                        Interactive progress bars and daily spending caps act as financial guardrails. By seeing the "spill-over" effect of an expensive activity, you can adjust following days to match your total trip goal.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                        Why this view is critical
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed pl-3.5">
                        Travel fatigue often leads to impulsive spending. Having a clear, day-by-day financial roadmap empowers you to make trade-offs (e.g., a luxury dinner tonight vs. a guided tour tomorrow) without anxiety.
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-gray-600">Total Planned</span>
                        <span className="text-blue-600">65%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 italic">"Travel is the only thing you buy that makes you richer."</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                  <h4 className="font-bold mb-2">Need to adjust?</h4>
                  <p className="text-sm text-blue-100 mb-4 opacity-90">Your budget is flexible. You can always swap activities or find cheaper alternatives.</p>
                  <button className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
                    Edit Itinerary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community (Shared Trips) Section */}
        <section className="mb-12" id="community-section">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Community & Shared Trips
              </h2>
              <p className="text-gray-600">
                Discover itineraries from fellow travelers and start your next journey
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
              <span className="text-purple-600 font-bold">Community Choice</span>
              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">New</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shared Trips List */}
            <div className="lg:col-span-2 space-y-6">
              {sharedTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 bg-gray-50 flex items-center justify-center text-5xl p-6">
                      {trip.image}
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{trip.name}</h3>
                          <p className="text-sm text-gray-500">by {trip.author}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-yellow-500 font-bold">
                            <span className="mr-1">★</span> {trip.rating}
                          </div>
                          <p className="text-xs text-gray-400">{trip.copiedCount} copies</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {trip.tags.map(tag => (
                          <span key={tag} className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {trip.summary}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-4 text-sm">
                          <span className="flex items-center text-gray-500">
                            <span className="mr-1">🕒</span> {trip.duration}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <span className="mr-1">📍</span> {trip.destinations.length} Stops
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() => setActivePreview(trip)}
                          >
                            Preview
                          </button>
                          <button
                            className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center"
                            onClick={() => alert(`Copied "${trip.name}" to your trips!`)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                            Copy Trip
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Community Explanation Column */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-2">🌍</span> Community Insight
                  </h3>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        Purpose of sharing itineraries
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed pl-3.5">
                        Sharing itineraries transforms travel from a solo endeavor into a collaborative experience. It helps fellow travelers avoid common pitfalls and discover hidden gems through collective wisdom.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                        Privacy considerations
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed pl-3.5">
                        We prioritize your security. When you share a trip, we automatically strip away personal identifiers like hotel details or private notes, keeping only the route and public activities.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></div>
                        Why this is optional but valuable
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed pl-3.5">
                        Sharing is 100% voluntary. While private planning is great, contributing itineraries helps build a richer ecosystem, earns you community badges, and aids others in traveling safely.
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 text-center font-medium italic">
                        "Your experiences are the map for someone else's next great adventure."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview Modal Hint */}
                {activePreview && (
                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold">Trip Preview</h4>
                      <button onClick={() => setActivePreview(null)} className="text-white opacity-70 hover:opacity-100">✕</button>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">Route</p>
                      <p className="font-bold">{activePreview.destinations.join(" → ")}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">Budget</p>
                        <p className="font-bold">{activePreview.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">Best Time</p>
                        <p className="font-bold">{activePreview.bestTime}</p>
                      </div>
                    </div>
                    <button
                      className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                      onClick={() => {
                        alert(`Successfully copied "${activePreview.name}" to your trips!`);
                        setActivePreview(null);
                      }}
                    >
                      Copy to My Trips
                    </button>
                    <p className="text-[10px] text-center mt-3 text-blue-200">This itinerary will be added to your planning list for full editing.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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

            <a
              href="#community-section"
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
            </a>

            <Link
              to="/profile"
              className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl p-6 hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 group"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-white/20 text-2xl group-hover:bg-white/30 transition-colors">
                  ⚙️
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Account & Settings</h3>
                  <p className="text-orange-100 text-sm">
                    Manage your profile
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
