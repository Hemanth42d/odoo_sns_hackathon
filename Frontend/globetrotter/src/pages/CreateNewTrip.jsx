import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CreateNewTrip() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tripName: "",
    startDate: "",
    endDate: "",
    numberOfTravelers: 1,
    initialDestination: "",
    theme: "",
    budget: "",
    travelStyle: "",
    interests: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular destinations for suggestions
  const popularDestinations = [
    {
      name: "Paris, France",
      type: "city",
      icon: "🗼",
      description: "Art, culture, and romance",
    },
    {
      name: "Tokyo, Japan",
      type: "city",
      icon: "🏯",
      description: "Modern meets traditional",
    },
    {
      name: "New York City, USA",
      type: "city",
      icon: "🗽",
      description: "The city that never sleeps",
    },
    {
      name: "Bali, Indonesia",
      type: "island",
      icon: "🏝️",
      description: "Tropical paradise",
    },
    {
      name: "Rome, Italy",
      type: "city",
      icon: "🏛️",
      description: "Ancient history and cuisine",
    },
    {
      name: "Barcelona, Spain",
      type: "city",
      icon: "🏰",
      description: "Architecture and beaches",
    },
    {
      name: "Iceland",
      type: "country",
      icon: "🏔️",
      description: "Northern lights and geysers",
    },
    {
      name: "Thailand",
      type: "country",
      icon: "🛺",
      description: "Temples and street food",
    },
  ];

  // Trip themes for suggestions
  const tripThemes = [
    {
      name: "Cultural Explorer",
      icon: "🏛️",
      description: "Museums, history, local traditions",
    },
    {
      name: "Adventure Seeker",
      icon: "🏔️",
      description: "Hiking, extreme sports, outdoor activities",
    },
    {
      name: "Beach Relaxer",
      icon: "🏖️",
      description: "Coastal resorts, water sports, sunbathing",
    },
    {
      name: "Food Enthusiast",
      icon: "🍜",
      description: "Local cuisine, cooking classes, food tours",
    },
    {
      name: "City Explorer",
      icon: "🏙️",
      description: "Urban attractions, nightlife, shopping",
    },
    {
      name: "Nature Lover",
      icon: "🌲",
      description: "National parks, wildlife, scenic routes",
    },
    {
      name: "Digital Nomad",
      icon: "💻",
      description: "Work-friendly destinations, coworking spaces",
    },
    {
      name: "Photography Trip",
      icon: "📸",
      description: "Scenic locations, golden hour spots",
    },
  ];

  const budgetRanges = [
    "Under $1,000",
    "$1,000 - $3,000",
    "$3,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000+",
    "I'll decide later",
  ];

  const travelStyles = [
    "Luxury",
    "Mid-range",
    "Budget",
    "Backpacking",
    "Mixed",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "interests") {
        const updatedInterests = checked
          ? [...formData.interests, value]
          : formData.interests.filter((interest) => interest !== value);
        setFormData((prev) => ({ ...prev, interests: updatedInterests }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Generate suggestions when destination or theme changes
    if (name === "initialDestination" && value.length > 2) {
      generateDestinationSuggestions(value);
    } else if (name === "theme") {
      generateThemeSuggestions(value);
    }
  };

  const generateDestinationSuggestions = (query) => {
    const filtered = popularDestinations.filter(
      (dest) =>
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.description.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 4));
    setShowSuggestions(true);
  };

  const generateThemeSuggestions = (selectedTheme) => {
    if (selectedTheme) {
      const theme = tripThemes.find((t) => t.name === selectedTheme);
      if (theme) {
        // Generate destination suggestions based on theme
        let themeSuggestions = [];
        switch (selectedTheme) {
          case "Cultural Explorer":
            themeSuggestions = popularDestinations.filter((d) =>
              ["Rome, Italy", "Paris, France", "Tokyo, Japan"].includes(d.name)
            );
            break;
          case "Adventure Seeker":
            themeSuggestions = popularDestinations.filter((d) =>
              ["Iceland", "New Zealand", "Nepal"].includes(d.name)
            );
            break;
          case "Beach Relaxer":
            themeSuggestions = popularDestinations.filter((d) =>
              ["Bali, Indonesia", "Maldives", "Caribbean"].includes(d.name)
            );
            break;
          default:
            themeSuggestions = popularDestinations.slice(0, 3);
        }
        setSuggestions(themeSuggestions);
        setShowSuggestions(true);
      }
    }
  };

  const selectSuggestion = (suggestion) => {
    setFormData((prev) => ({ ...prev, initialDestination: suggestion.name }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const validateForm = () => {
    const newErrors = {};

    // Step 1: Basic Information
    if (currentStep >= 1) {
      if (!formData.tripName.trim()) {
        newErrors.tripName = "Trip name is required";
      }

      if (!formData.startDate) {
        newErrors.startDate = "Start date is required";
      }

      if (!formData.endDate) {
        newErrors.endDate = "End date is required";
      } else if (
        formData.startDate &&
        new Date(formData.endDate) <= new Date(formData.startDate)
      ) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    // Step 2: Destination/Theme
    if (currentStep >= 2) {
      if (!formData.initialDestination.trim() && !formData.theme) {
        newErrors.general =
          "Please provide either a destination or select a theme";
      }
    }

    return newErrors;
  };

  const handleNext = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Calculate trip duration
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      // Generate unique trip ID
      const tripId = `trip_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Create trip object with comprehensive data structure
      const newTrip = {
        id: tripId,
        name: formData.tripName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: duration,
        numberOfTravelers: formData.numberOfTravelers,

        // Destination & Theme
        initialDestination: formData.initialDestination,
        theme: formData.theme,

        // Preferences
        budget: formData.budget,
        travelStyle: formData.travelStyle,
        interests: formData.interests,

        // Trip Status & Metadata
        status: "planning", // planning, active, completed, cancelled
        progress: {
          destinations: formData.initialDestination ? 1 : 0,
          accommodations: 0,
          activities: 0,
          transportation: 0,
          completed: false,
        },

        // Initial trip structure
        destinations: formData.initialDestination
          ? [
              {
                id: `dest_${Date.now()}`,
                name: formData.initialDestination,
                arrivalDate: formData.startDate,
                departureDate: formData.endDate,
                isMainDestination: true,
                accommodations: [],
                activities: [],
                transportation: [],
              },
            ]
          : [],

        // Itinerary structure for builder
        itinerary: {
          stops: formData.initialDestination
            ? [
                {
                  id: `stop_${Date.now()}`,
                  name: formData.initialDestination,
                  country: "",
                  arrivalDate: formData.startDate,
                  departureDate: formData.endDate,
                  accommodation: {
                    name: "",
                    type: "hotel",
                    pricePerNight: 0,
                    nights: duration,
                  },
                  dailyBudget: formData.budget
                    ? Math.round(
                        parseFloat(formData.budget.replace(/[^0-9.-]+/g, "")) /
                          duration
                      )
                    : 100,
                  totalBudget: 0,
                  spentBudget: 0,
                  activities: [],
                  notes: "",
                  order: 0,
                },
              ]
            : [],
        },

        // Financial tracking
        budgetTracking: {
          totalBudget: formData.budget
            ? parseFloat(formData.budget.replace(/[^0-9.-]+/g, ""))
            : null,
          spent: 0,
          categories: {
            accommodation: 0,
            transportation: 0,
            food: 0,
            activities: 0,
            shopping: 0,
            other: 0,
          },
        },

        // Collaboration
        collaborators: [
          {
            id: "current_user",
            role: "owner",
            name: "Current User", // Would be actual user data
            permissions: ["edit", "delete", "invite"],
          },
        ],

        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "current_user",
      };

      // Store trip in localStorage (in real app, this would be API call)
      const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]");
      const updatedTrips = [...existingTrips, newTrip];
      localStorage.setItem("trips", JSON.stringify(updatedTrips));

      // Update user's trip count
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.tripCount = (user.tripCount || 0) + 1;
      localStorage.setItem("user", JSON.stringify(user));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to trip planning page or dashboard
      navigate(`/trip/${tripId}/plan`, {
        state: {
          newTrip: true,
          tripData: newTrip,
        },
      });
    } catch (err) {
      setErrors({ general: "Failed to create trip. Please try again." });
      setLoading(false);
    }
  };

  const getTripDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return duration > 0
        ? `${duration} ${duration === 1 ? "day" : "days"}`
        : "";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <h2 className="text-2xl font-bold text-blue-600">GlobeTrotter</h2>
          </Link>

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <span className="text-sm text-gray-600">Details</span>
            </div>

            <div
              className={`w-8 h-0.5 ${
                currentStep > 1 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>

            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span className="text-sm text-gray-600">Destination</span>
            </div>

            <div
              className={`w-8 h-0.5 ${
                currentStep > 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>

            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
              <span className="text-sm text-gray-600">Preferences</span>
            </div>
          </div>

          <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
            Cancel
          </Link>
        </div>
      </header>

      {/* Create Trip Form */}
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
              <div className="max-w-2xl mx-auto text-center">
                {currentStep === 1 && (
                  <>
                    <h1 className="text-3xl font-bold mb-2">Create New Trip</h1>
                    <p className="text-blue-100">
                      Let's start planning your next adventure
                    </p>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h1 className="text-3xl font-bold mb-2">
                      Choose Your Destination
                    </h1>
                    <p className="text-blue-100">
                      Where would you like to go, or what's your travel style?
                    </p>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h1 className="text-3xl font-bold mb-2">
                      Travel Preferences
                    </h1>
                    <p className="text-blue-100">
                      Help us suggest the perfect itinerary
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                {/* Step 1: Trip Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Trip Details
                      </h2>
                      <p className="text-gray-600">
                        Basic information to get started with your trip planning
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="tripName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Trip Name *
                      </label>
                      <input
                        type="text"
                        id="tripName"
                        name="tripName"
                        value={formData.tripName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.tripName ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="e.g., European Summer Adventure"
                      />
                      {errors.tripName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.tripName}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Give your trip a memorable name to help you organize and
                        share it
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Start Date *
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.startDate
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.startDate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.startDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          End Date *
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          min={
                            formData.startDate ||
                            new Date().toISOString().split("T")[0]
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.endDate
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.endDate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.endDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {getTripDuration() && (
                      <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700">
                          <span className="text-sm font-medium">
                            Trip Duration: {getTripDuration()}
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="numberOfTravelers"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Number of Travelers
                      </label>
                      <select
                        id="numberOfTravelers"
                        name="numberOfTravelers"
                        value={formData.numberOfTravelers}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "person" : "people"}
                          </option>
                        ))}
                        <option value="10+">More than 10 people</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Helps us suggest appropriate accommodations and group
                        activities
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        Next: Choose Destination →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Destination & Theme */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Destination & Theme
                      </h2>
                      <p className="text-gray-600">
                        Tell us where you want to go or what type of experience
                        you're looking for
                      </p>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="initialDestination"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Initial Destination (Optional)
                      </label>
                      <input
                        type="text"
                        id="initialDestination"
                        name="initialDestination"
                        value={formData.initialDestination}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="e.g., Paris, Tokyo, or leave blank to explore themes"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter a city, country, or region you'd like to visit
                      </p>

                      {/* Destination Suggestions */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectSuggestion(suggestion)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg"
                            >
                              <span className="text-2xl">
                                {suggestion.icon}
                              </span>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {suggestion.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {suggestion.description}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-center my-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">
                            or choose a theme
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Travel Theme (Optional)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tripThemes.map((theme) => (
                          <label
                            key={theme.name}
                            className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                              formData.theme === theme.name
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name="theme"
                              value={theme.name}
                              checked={formData.theme === theme.name}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <span className="text-2xl mr-3">{theme.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900">
                                {theme.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {theme.description}
                              </div>
                            </div>
                            {formData.theme === theme.name && (
                              <div className="absolute top-2 right-2">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Themes help us suggest destinations and activities that
                        match your interests
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        Next: Preferences →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Travel Preferences */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Travel Preferences
                      </h2>
                      <p className="text-gray-600">
                        Help us create the perfect itinerary for your trip (all
                        optional)
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Estimated Budget (Optional)
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Helps us suggest appropriate accommodations and
                        activities
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="travelStyle"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Travel Style (Optional)
                      </label>
                      <select
                        id="travelStyle"
                        name="travelStyle"
                        value={formData.travelStyle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select travel style</option>
                        {travelStyles.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Influences accommodation and activity suggestions
                      </p>
                    </div>

                    {/* Summary Box */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Trip Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trip Name:</span>
                          <span className="font-medium">
                            {formData.tripName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {getTripDuration()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Travelers:</span>
                          <span className="font-medium">
                            {formData.numberOfTravelers}{" "}
                            {formData.numberOfTravelers === 1
                              ? "person"
                              : "people"}
                          </span>
                        </div>
                        {formData.initialDestination && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Destination:</span>
                            <span className="font-medium">
                              {formData.initialDestination}
                            </span>
                          </div>
                        )}
                        {formData.theme && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Theme:</span>
                            <span className="font-medium">
                              {formData.theme}
                            </span>
                          </div>
                        )}
                        {formData.budget && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Budget:</span>
                            <span className="font-medium">
                              {formData.budget}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Creating Trip...
                          </div>
                        ) : (
                          "Create Trip"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* Help Section */}
              <div className="mt-8 max-w-2xl mx-auto">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    What happens next?
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • Your trip will be created and saved to your dashboard
                    </li>
                    <li>• You'll be taken to the trip planning interface</li>
                    <li>
                      • AI will suggest destinations, accommodations, and
                      activities
                    </li>
                    <li>
                      • You can invite others to collaborate on the planning
                    </li>
                    <li>
                      • Track your budget and manage bookings in one place
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateNewTrip;
