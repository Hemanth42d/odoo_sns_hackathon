import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { destinations } from "../data/destinationsData";

export default function DestinationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dest, setDest] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const foundDest = destinations.find((d) => d.id === parseInt(id));
        if (foundDest) {
            setDest(foundDest);
        }
    }, [id]);

    if (!dest) {
        return (
            <div className="min-h-screen border-red-500 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Destination Not Found</h1>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-4 text-blue-600 font-bold hover:underline"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Side: Images & Info */}
                    <div className="lg:w-2/3">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{dest.name}</h1>
                        <div className="flex items-center space-x-4 mb-6 text-sm font-semibold">
                            <span className="flex items-center">⭐ {dest.rating}</span>
                            <span className="underline">{dest.reviews} reviews</span>
                            <span className="underline">{dest.location}</span>
                        </div>

                        <div className="rounded-3xl overflow-hidden h-[500px] shadow-2xl mb-8">
                            <img
                                src={dest.image}
                                className="w-full h-full object-cover"
                                alt={dest.name}
                            />
                        </div>

                        <div className="border-b border-gray-200 pb-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4">About this place</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {dest.description}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">What this place offers</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {dest.amenities.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-3 text-gray-700">
                                        <span className="text-blue-500 font-bold">✓</span>
                                        <span className="text-lg">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Booking Card */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32 border border-gray-200 rounded-3xl p-8 shadow-2xl bg-white">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <span className="text-3xl font-black">${dest.price}</span>
                                    <span className="text-gray-500 font-bold ml-1">night</span>
                                </div>
                                <div className="flex items-center font-bold">
                                    ⭐ {dest.rating}
                                </div>
                            </div>

                            <div className="border border-gray-300 rounded-xl overflow-hidden mb-6">
                                <div className="grid grid-cols-2 border-b border-gray-300">
                                    <div className="p-3 border-r border-gray-300">
                                        <label className="block text-[10px] font-black uppercase text-gray-500">Check-in</label>
                                        <span className="text-sm font-medium">{dest.date.split('-')[0]}</span>
                                    </div>
                                    <div className="p-3">
                                        <label className="block text-[10px] font-black uppercase text-gray-500">Checkout</label>
                                        <span className="text-sm font-medium">{dest.date.split('-')[1]}</span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <label className="block text-[10px] font-black uppercase text-gray-500">Travelers</label>
                                    <span className="text-sm font-medium">1 guest</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/create-trip")}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-xl hover:scale-[1.02] transition-all shadow-xl mb-4"
                            >
                                Book This Trip
                            </button>

                            <div className="text-center text-sm text-gray-500 font-medium italic">
                                You won't be charged yet
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center font-bold text-xl">
                                <span>Total</span>
                                <span>${dest.price}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
