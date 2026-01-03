import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminAnalytics() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    const adminStats = {
        totalUsers: "1,248",
        tripsCreated: "3,452",
        popularCities: ["Tokyo (🇯🇵)", "Paris (🇫🇷)", "Bali (🇮🇩)", "Reykjavik (🇮🇸)"],
        popularActivities: ["Alpine Hiking", "Street Food Tours", "Museum Crawls"],
        usageTrend: "+15.4%",
        activeNow: "84",
        revenue: "$12,450",
        systemHealth: "99.9%"
    };

    const recentUsers = [
        { id: 1, name: "Sarah Jenkins", email: "sarah.j@example.com", status: "Active", trips: 4 },
        { id: 2, name: "Marc Rivera", email: "marc.riv@example.com", status: "Active", trips: 12 },
        { id: 3, name: "Aisha Khan", email: "aisha.k@example.com", status: "Inactive", trips: 0 },
        { id: 4, name: "Tom Wilson", email: "tom.w@example.com", status: "Active", trips: 7 },
    ];

    const handleLogout = () => {
        // In a real app, this would clear admin token
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 hidden lg:flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-black text-blue-400 tracking-tighter">GLOBETROTTER</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Admin Control Center</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {[
                        { id: "overview", label: "Overview", icon: "📊" },
                        { id: "users", label: "User Management", icon: "👤" },
                        { id: "trips", label: "Trip Analytics", icon: "✈️" },
                        { id: "reports", label: "System Reports", icon: "📄" },
                        { id: "settings", label: "Admin Settings", icon: "⚙️" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:bg-slate-700 hover:text-white"
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-red-600 px-4 py-3 rounded-xl transition-all font-bold text-sm"
                    >
                        <span>🚪</span>
                        <span>Exit Admin Mode</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="h-20 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-8">
                    <div className="flex items-center space-x-4">
                        <div className="lg:hidden text-2xl font-black text-blue-400 italic">GT</div>
                        <h1 className="text-xl font-bold flex items-center">
                            <span className="text-slate-400 mr-2 capitalize">{activeTab}</span>
                            <span className="text-slate-600 mx-2">/</span>
                            <span>Dashboard</span>
                        </h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-bold">Administator</span>
                            <span className="text-[10px] text-green-400 font-bold flex items-center justify-end">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                System Connection: Optimal
                            </span>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                            A
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-900">
                    {activeTab === "overview" && (
                        <div className="space-y-10">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: "Total Users", value: adminStats.totalUsers, trend: "↑ 12%", color: "blue" },
                                    { label: "Trips Planned", value: adminStats.tripsCreated, trend: "+15.4%", color: "green" },
                                    { label: "Est. Revenue", value: adminStats.revenue, trend: "↑ 5%", color: "purple" },
                                    { label: "Active Sessions", value: adminStats.activeNow, trend: "8 online", color: "red", animate: true },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl group hover:border-blue-500/50 transition-all">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{stat.label}</p>
                                        <div className="flex items-end justify-between">
                                            <h3 className={`text-3xl font-black ${stat.color === 'red' ? 'text-red-400' : 'text-white'}`}>{stat.value}</h3>
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.color === 'green' ? 'bg-green-400/10 text-green-400' :
                                                    stat.color === 'blue' ? 'bg-blue-400/10 text-blue-400' :
                                                        stat.color === 'purple' ? 'bg-purple-400/10 text-purple-400' : 'bg-red-400/10 text-red-400'
                                                }`}>
                                                {stat.trend}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts & Rationale Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-xl">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-lg font-black flex items-center">
                                            <span className="mr-3">📈</span> Growth Vector
                                        </h3>
                                        <div className="flex space-x-2">
                                            <select className="bg-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-blue-500">
                                                <option>Last 30 Days</option>
                                                <option>Last 6 Months</option>
                                                <option>Year to Date</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                                        {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 100, 110].map((height, i) => (
                                            <div key={i} className="flex-1 group relative">
                                                <div
                                                    className="bg-blue-600/20 group-hover:bg-blue-500 transition-all rounded-t-lg cursor-pointer"
                                                    style={{ height: `${height}%` }}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex justify-between px-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
                                    </div>
                                </div>

                                <div className="lg:col-span-1 bg-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all"></div>
                                    <h3 className="text-xl font-black mb-6">Admin Rationale</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Platform Isolation</p>
                                            <p className="text-xs leading-relaxed text-blue-50">This standalone dashboard ensures that administrative oversight never interferes with the end-user experience.</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Advanced Analytics</p>
                                            <p className="text-xs leading-relaxed text-blue-50">Deep-dive telemetry across all users allows for trend prediction and infrastructure auto-scaling visualization.</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Hackathon Strategy</p>
                                            <p className="text-xs leading-relaxed text-blue-50">Demonstrating a separate biz-ops panel proves this transition from a simple MVP to a scalable SaaS architecture.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Data Table */}
                            <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
                                <div className="p-8 border-b border-slate-700 flex items-center justify-between">
                                    <h3 className="text-lg font-black">Recent User Activity</h3>
                                    <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">View All Users →</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase">User</th>
                                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase">Status</th>
                                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase text-center">Trips Created</th>
                                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentUsers.map((u) => (
                                                <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                                    <td className="p-6">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center font-bold text-xs">{u.name.charAt(0)}</div>
                                                            <div>
                                                                <p className="font-bold text-sm tracking-tight">{u.name}</p>
                                                                <p className="text-[10px] text-slate-500">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md ${u.status === 'Active' ? 'bg-green-400/10 text-green-400' : 'bg-slate-600/10 text-slate-400'}`}>
                                                            {u.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-center text-sm font-bold text-slate-300">{u.trips}</td>
                                                    <td className="p-6 text-right">
                                                        <button className="text-slate-400 hover:text-white transition-colors">•••</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== "overview" && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
                            <div className="text-6xl mb-4">🚧</div>
                            <h3 className="text-xl font-bold text-slate-400 tracking-tight capitalize">{activeTab} Details Coming Soon</h3>
                            <p className="text-sm">This module is currently being optimized for high-volume data ingestion.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminAnalytics;
