import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ItineraryBudget from "../components/ItineraryBudget";


export default function ItineraryBudgetPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    <h1 className="text-3xl font-bold text-gray-900">Itinerary & Budget</h1>
                    <p className="text-gray-600">Plan your days and track your expenses.</p>
                </div>

                <ItineraryBudget mockItineraryData={mockItineraryData} />
            </main>
        </div>
    );
}
