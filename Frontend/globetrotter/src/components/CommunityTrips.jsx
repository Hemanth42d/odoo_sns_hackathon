import { useState } from "react";

export default function CommunityTrips({ sharedTrips }) {
    const [activePreview, setActivePreview] = useState(null);

    return (
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
    );
}
