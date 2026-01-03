import { useState } from "react";

export default function CalendarView({ trips, mockItineraryData }) {
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
