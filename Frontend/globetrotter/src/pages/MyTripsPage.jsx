import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MyTripsPage() {
    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        upcoming: 0,
        completed: 0,
        totalBudget: 0,
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const loadTrips = async () => {
            setLoading(true);
            try {
                // Mock data (same as Dashboard for consistency)
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

        loadTrips();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 text-blue-600 border-4 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Trips</h1>
                    <p className="text-xl text-gray-500 mt-2">Manage your adventures and track your travel stats.</p>
                </div>

                {/* Travel Stats Segment */}
                <section className="mb-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Total Trips", count: stats.total, icon: "🧳", color: "bg-blue-50 text-blue-600" },
                            { label: "Upcoming", count: stats.upcoming, icon: "✈️", color: "bg-emerald-50 text-emerald-600" },
                            { label: "Completed", count: stats.completed, icon: "✅", color: "bg-purple-50 text-purple-600" },
                            { label: "Total Budget", count: `$${stats.totalBudget.toLocaleString()}`, icon: "💰", color: "bg-amber-50 text-amber-600" },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white px-6 py-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>{stat.icon}</div>
                                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trip List */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">All Adventures</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trips.map((trip) => (
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
                </section>

                {/* Quick Actions */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Quick Actions</h2>
                        <div className="h-px flex-1 bg-gray-200 mx-8 hidden md:block"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link to="/create-trip" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all transform hover:-translate-y-1 group shadow-sm">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">✈️</div>
                            <h3 className="text-lg font-bold text-gray-900">Plan New Trip</h3>
                            <p className="text-gray-500 text-sm mt-1">Multi-city adventure planning</p>
                        </Link>
                        <Link to="/explore" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all transform hover:-translate-y-1 group shadow-sm">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🌍</div>
                            <h3 className="text-lg font-bold text-gray-900">Explore</h3>
                            <p className="text-gray-500 text-sm mt-1">Discover amazing places</p>
                        </Link>
                        <Link to="/community" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all transform hover:-translate-y-1 group shadow-sm">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">👥</div>
                            <h3 className="text-lg font-bold text-gray-900">Community</h3>
                            <p className="text-gray-500 text-sm mt-1">Get travel inspiration</p>
                        </Link>
                        <Link to="/profile" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all transform hover:-translate-y-1 group shadow-sm">
                            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
                            <h3 className="text-lg font-bold text-gray-900">Settings</h3>
                            <p className="text-gray-500 text-sm mt-1">Manage your account</p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
