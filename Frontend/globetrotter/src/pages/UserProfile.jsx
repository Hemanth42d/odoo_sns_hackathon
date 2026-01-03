import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "Alex",
    lastName: "Smith",
    email: "alex.smith@example.com",
    bio: "Passionate traveler and food enthusiast. Always looking for the next hidden gem in Europe.",
    location: "London, UK",
    phoneNumber: "+44 7700 900000",
    preferences: {
      budgetType: "Mid-range",
      travelStyle: "Cultural",
      notificationEnabled: true
    },
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  });

  const [trips, setTrips] = useState([
    {
      id: 1,
      name: "European Adventure 2024",
      destinations: ["Paris", "Amsterdam", "Berlin"],
      startDate: "2024-06-15",
      status: "upcoming",
      image: "🏰"
    },
    {
      id: 2,
      name: "Southeast Asia Explorer",
      destinations: ["Bangkok", "Ho Chi Minh", "Siem Reap"],
      startDate: "2024-03-10",
      status: "completed",
      image: "🏯"
    },
    {
      id: 4,
      name: "Swiss Alps Hiking",
      destinations: ["Zermatt", "Interlaken"],
      startDate: "2024-09-20",
      status: "planned",
      image: "🏔️"
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(prev => ({ ...prev, ...parsed }));
      setEditedUser(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const handleSave = () => {
    setUser(editedUser);
    localStorage.setItem("user", JSON.stringify(editedUser));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Reusing Dashboard style */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <h2 className="text-2xl font-bold text-blue-600">GlobeTrotter</h2>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 font-medium pb-1">Dashboard</Link>
              <Link to="/trips" className="text-gray-500 hover:text-blue-600 font-medium pb-1">My Trips</Link>
              <Link to="/create-trip" className="text-gray-500 hover:text-blue-600 font-medium pb-1">Create Trip</Link>
              <Link to="/profile" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">Profile</Link>
            </nav>

            <div className="flex items-center space-x-4">
               <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="px-6 pb-6 text-center -mt-16">
                <div className="relative inline-block">
                  <img 
                    src={user.profileImage} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white"
                  />
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <h1 className="mt-4 text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                <p className="text-gray-500">{user.location}</p>
                <p className="mt-4 text-gray-600 text-sm italic">"{user.bio}"</p>
                
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{trips.length}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Countries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Quick Links */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Account Management</h3>
              </div>
              <div className="p-2">
                {[
                  { name: "My Subscription", icon: "💎", color: "text-purple-600" },
                  { name: "Security & Privacy", icon: "🔒", color: "text-blue-600" },
                  { name: "Notification Preferences", icon: "🔔", color: "text-orange-600" },
                  { name: "Payment Methods", icon: "💳", color: "text-green-600" },
                  { name: "Help & Support", icon: "🎧", color: "text-gray-600" },
                  { name: "Delete Account", icon: "⚠️", color: "text-red-500" },
                ].map((item) => (
                  <button key={item.name} className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group">
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className={`flex-grow text-sm font-medium ${item.name === 'Delete Account' ? 'text-red-500' : 'text-gray-700'}`}>{item.name}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Details & Trips */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Editable Info Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900">Personal Details</h3>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                    {isEditing ? (
                      <input 
                        name="firstName"
                        value={editedUser.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                    {isEditing ? (
                      <input 
                        name="lastName"
                        value={editedUser.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                    {isEditing ? (
                      <input 
                        name="email"
                        value={editedUser.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                    {isEditing ? (
                      <input 
                        name="location"
                        value={editedUser.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user.location}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                    {isEditing ? (
                      <textarea 
                        name="bio"
                        rows="3"
                        value={editedUser.bio}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.bio}</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Travel Preferences
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600 uppercase tracking-wider font-bold mb-1">Travel Style</p>
                        <p className="text-blue-900 font-semibold">{user.preferences.travelStyle}</p>
                     </div>
                     <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <p className="text-xs text-purple-600 uppercase tracking-wider font-bold mb-1">Budget Preference</p>
                        <p className="text-purple-900 font-semibold">{user.preferences.budgetType}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trips Lists */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Your Adventures</h3>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                  <button className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-md">All</button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">Planned</button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">Previous</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trips.map((trip) => (
                  <div key={trip.id} className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {trip.image}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 truncate">{trip.name}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          trip.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          trip.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{trip.destinations.join(" → ")}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
                <button className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-blue-300 hover:text-blue-500 transition-all group">
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                     </svg>
                   </div>
                   <span className="font-medium">Plan New Adventure</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Aesthetic Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2026 GlobeTrotter. Making every journey unforgettable.</p>
        </div>
      </footer>
    </div>
  );
}

export default UserProfile;
