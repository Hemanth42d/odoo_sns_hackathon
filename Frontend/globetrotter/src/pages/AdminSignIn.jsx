import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminSignIn() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Simplified logic for hackathon demo
        if (credentials.username === "admin" && credentials.password === "password") {
            localStorage.setItem("adminToken", "mock-admin-session-secret");
            navigate("/admin-analytics");
        } else {
            setError("Unauthorized access. Verification failed.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10 transition-all hover:border-slate-700">
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-xl shadow-blue-900/40">
                        📊
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Admin Portal</h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Internal Telemetry Access</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-400/10 border border-red-400/20 text-red-400 p-3 rounded-xl text-xs font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Username</label>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                            placeholder="admin"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-900/30 transform hover:-translate-y-1 active:scale-95 duration-200 mt-4"
                    >
                        Authenticate Session
                    </button>
                </form>

                <div className="mt-10 border-t border-slate-800 pt-6 text-center">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Access restricted to authorized personnel only</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 text-xs text-slate-500 hover:text-white transition-colors decoration-dotted underline"
                    >
                        Return to Public Site
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminSignIn;
