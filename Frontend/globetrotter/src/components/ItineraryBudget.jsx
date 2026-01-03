import { Link } from "react-router-dom";

export default function ItineraryBudget({ mockItineraryData }) {
    return (
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
    );
}
