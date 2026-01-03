import { useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [email, setEmail] = useState("");

  const handleGetStarted = (e) => {
    e.preventDefault();
    // Navigate to signup with email pre-filled
    window.location.href = `/signup?email=${email}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-blue-600">GlobeTrotter</h2>
          </div>
          <nav>
            <Link
              to="/signin"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Plan Multi-City Trips Like a Pro
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create detailed itineraries, track budgets, and coordinate travel
              across multiple cities - all in one platform.
            </p>

            {/* Quick Start Form */}
            <form
              onSubmit={handleGetStarted}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-4"
            >
              <input
                type="email"
                placeholder="Enter your email to get started"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </button>
            </form>

            <p className="text-sm text-gray-500">
              No credit card required • Free forever plan
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose GlobeTrotter?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Multi-City Planning
              </h3>
              <p className="text-gray-600">
                Plan complex trips across multiple cities with timeline
                coordination and travel connections.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Budget Tracking
              </h3>
              <p className="text-gray-600">
                Track expenses across all destinations with real-time budget
                calculations and cost warnings.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Easy Sharing
              </h3>
              <p className="text-gray-600">
                Share itineraries with travel companions or make them public for
                others to copy and adapt.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Works Everywhere
              </h3>
              <p className="text-gray-600">
                Access your trips from any device - desktop, tablet, or mobile.
                Your plans sync automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of travelers who use GlobeTrotter to plan amazing
            multi-city trips.
          </p>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Start Planning Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">
                GlobeTrotter
              </h3>
              <p className="text-gray-300">
                Making multi-city travel planning simple and enjoyable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a
                  href="#features"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#demo"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Demo
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a
                  href="#help"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Help Center
                </a>
                <a
                  href="#contact"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </a>
                <a
                  href="#privacy"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Privacy
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 GlobeTrotter. All rights reserved. |{" "}
              <Link to="/admin-login" className="hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100">Admin Portal</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
