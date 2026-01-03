import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CommunityTrips from "../components/CommunityTrips";


export default function CommunityPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                <div className="animate-spin h-8 w-8 text-blue-600 border-4 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Travel Community</h1>
                    <p className="text-gray-600">Get inspired by itineraries from fellow globetrotters.</p>
                </div>

                <CommunityTrips sharedTrips={sharedTrips} />
            </main>
        </div>
    );
}
