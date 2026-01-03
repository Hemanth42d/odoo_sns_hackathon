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

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
