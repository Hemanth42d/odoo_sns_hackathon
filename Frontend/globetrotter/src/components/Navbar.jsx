import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user }) {
    const location = useLocation();

    const navLinks = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "My Trips", path: "/trips" },
        { name: "Create Trip", path: "/create-trip" },
        { name: "Calendar", path: "/calendar" },
        { name: "Itinerary", path: "/itinerary" },
        { name: "Community", path: "/community" },
        { name: "Profile", path: "/profile" },
    ];

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="fixed top-4 left-0 right-0 z-50 px-4">
            <header className="max-w-7xl mx-auto bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300">
                <div className="px-6 py-3 flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <span className="text-2xl mr-2 group-hover:rotate-12 transition-transform duration-300">✈️</span>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                GlobeTrotter
                            </h2>
                        </Link>
                    </div>

                    <nav className="hidden xl:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                                            : "text-gray-600 hover:bg-white/50 hover:text-blue-600"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-xs text-gray-400 font-medium">Welcome back,</span>
                            <Link to="/profile" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors">
                                {user?.firstName || "Traveler"}
                            </Link>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-gray-100/80 hover:bg-red-50 text-gray-700 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200/50 transition-all duration-200 flex items-center shadow-sm"
                        >
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
}
