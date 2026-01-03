import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    totalBudget: 0,
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load trips data (mock data for now)
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/trips', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });

      // Mock data for development
      const mockTrips = [
        {
          id: 1,
          name: "European Adventure 2024",
          destinations: ["Paris", "Amsterdam", "Berlin"],
          startDate: "2024-06-15",
          endDate: "2024-06-28",
          budget: 3000,
          spent: 2100,
          status: "upcoming",
        },
        {
          id: 2,
          name: "Southeast Asia Explorer",
          destinations: ["Bangkok", "Ho Chi Minh", "Siem Reap"],
          startDate: "2024-03-10",
          endDate: "2024-03-24",
          budget: 2200,
          spent: 2050,
          status: "completed",
        },
        {
          id: 3,
          name: "California Coast Road Trip",
          destinations: ["San Francisco", "Los Angeles", "San Diego"],
          startDate: "2024-08-01",
          endDate: "2024-08-10",
          budget: 2500,
          spent: 0,
          status: "planning",
        },
      ];

      setTrips(mockTrips);

      // Calculate stats
      const totalTrips = mockTrips.length;
      const upcomingTrips = mockTrips.filter(
        (trip) => trip.status === "upcoming" || trip.status === "planning"
      ).length;
      const completedTrips = mockTrips.filter(
        (trip) => trip.status === "completed"
      ).length;
      const totalBudget = mockTrips.reduce((sum, trip) => sum + trip.budget, 0);

      setStats({
        total: totalTrips,
        upcoming: upcomingTrips,
        completed: completedTrips,
        totalBudget: totalBudget,
      });
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "green";
      case "upcoming":
        return "blue";
      case "planning":
        return "orange";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Loading your trips...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Link to="/">
                <h2>GlobeTrotter</h2>
              </Link>
            </div>
            <nav className="main-nav">
              <Link to="/dashboard" className="nav-link active">
                Dashboard
              </Link>
              <Link to="/trips" className="nav-link">
                My Trips
              </Link>
              <Link to="/create-trip" className="nav-link">
                Create Trip
              </Link>
            </nav>
            <div className="user-menu">
              <div className="user-info">
                <span>Hello, {user?.firstName || "Traveler"}!</span>
              </div>
              <button
                className="btn-logout"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h1>Welcome back, {user?.firstName || "Traveler"}!</h1>
              <p>
                Ready to plan your next adventure? Here's what's happening with
                your trips.
              </p>
            </div>
            <div className="quick-actions">
              <Link to="/create-trip" className="btn-primary">
                + Create New Trip
              </Link>
            </div>
          </section>

          {/* Stats Cards */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🧳</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">Total Trips</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✈️</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.upcoming}</div>
                  <div className="stat-label">Upcoming Trips</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.completed}</div>
                  <div className="stat-label">Completed</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <div className="stat-number">
                    ${stats.totalBudget.toLocaleString()}
                  </div>
                  <div className="stat-label">Total Budget</div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Trips */}
          <section className="trips-section">
            <div className="section-header">
              <h2>Your Trips</h2>
              <Link to="/trips" className="view-all-link">
                View All
              </Link>
            </div>

            {trips.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🌎</div>
                <h3>No trips yet</h3>
                <p>Create your first trip to start planning your adventure!</p>
                <Link to="/create-trip" className="btn-primary">
                  Create Your First Trip
                </Link>
              </div>
            ) : (
              <div className="trips-grid">
                {trips.map((trip) => (
                  <div key={trip.id} className="trip-card">
                    <div className="trip-header">
                      <h3 className="trip-name">{trip.name}</h3>
                      <span
                        className={`status-badge ${getStatusColor(
                          trip.status
                        )}`}
                      >
                        {trip.status}
                      </span>
                    </div>

                    <div className="trip-destinations">
                      <span className="destinations-label">Destinations:</span>
                      <div className="destinations-list">
                        {trip.destinations.map((dest, index) => (
                          <span key={index} className="destination">
                            {dest}
                            {index < trip.destinations.length - 1 && " → "}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="trip-dates">
                      <span className="date-icon">📅</span>
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </div>

                    <div className="trip-budget">
                      <div className="budget-info">
                        <span className="budget-label">Budget:</span>
                        <span className="budget-amount">
                          ${trip.budget.toLocaleString()}
                        </span>
                      </div>
                      {trip.spent > 0 && (
                        <div className="spent-info">
                          <span className="spent-label">Spent:</span>
                          <span className="spent-amount">
                            ${trip.spent.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="trip-actions">
                      <Link
                        to={`/trips/${trip.id}`}
                        className="btn-secondary btn-small"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/trips/${trip.id}/edit`}
                        className="btn-outline btn-small"
                      >
                        Edit Trip
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Links */}
          <section className="quick-links-section">
            <h2>Quick Actions</h2>
            <div className="quick-links-grid">
              <Link to="/create-trip" className="quick-link-card">
                <div className="quick-link-icon">➕</div>
                <div className="quick-link-content">
                  <h3>Create New Trip</h3>
                  <p>Start planning your next multi-city adventure</p>
                </div>
              </Link>

              <Link to="/explore" className="quick-link-card">
                <div className="quick-link-icon">🔍</div>
                <div className="quick-link-content">
                  <h3>Explore Destinations</h3>
                  <p>Discover popular cities and attractions</p>
                </div>
              </Link>

              <Link to="/shared-trips" className="quick-link-card">
                <div className="quick-link-icon">🤝</div>
                <div className="quick-link-content">
                  <h3>Browse Shared Trips</h3>
                  <p>Get inspiration from other travelers</p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
