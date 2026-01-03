import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import CreateNewTrip from "./pages/CreateNewTrip";
import TripPlanning from "./pages/TripPlanning";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import UserProfile from "./pages/UserProfile";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSignIn from "./pages/AdminSignIn";
import MyTripsPage from "./pages/MyTripsPage";
import DestinationDetails from "./pages/DestinationDetails";


import CalendarPage from "./pages/CalendarPage";
import ItineraryBudgetPage from "./pages/ItineraryBudgetPage";
import CommunityPage from "./pages/CommunityPage";





// Simple authentication check
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
              <Dashboard />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/create-trip"
            element={
              // <ProtectedRoute>
              <CreateNewTrip />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/trip/:tripId/plan"
            element={
              // <ProtectedRoute>
              <TripPlanning />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/trip/:tripId/itinerary"
            element={
              // <ProtectedRoute>
              <ItineraryBuilder />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              // <ProtectedRoute>
              <UserProfile />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/trips"
            element={
              // <ProtectedRoute>
              <MyTripsPage />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              // <ProtectedRoute>
              <CalendarPage />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/itinerary"
            element={
              // <ProtectedRoute>
              <ItineraryBudgetPage />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/destination/:id"
            element={
              // <ProtectedRoute>
              <DestinationDetails />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/community"
            element={

              // <ProtectedRoute>
              <CommunityPage />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/admin-login"
            element={<AdminSignIn />}
          />

          <Route
            path="/admin-analytics"
            element={
              <AdminAnalytics />
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
