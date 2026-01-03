import { useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // Account Information
    firstName: "",
    lastName: "",
    email: searchParams.get("email") || "",
    password: "",
    confirmPassword: "",

    // Profile Information
    profilePhoto: null,
    profilePhotoPreview: null,
    phoneNumber: "",
    city: "",
    country: "",
    additionalInfo: "",

    // Travel Preferences (derived from additional info)
    travelStyle: "",
    budgetRange: "",
    interests: [],

    acceptTerms: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Countries list for dropdown
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Australia",
    "Japan",
    "India",
    "Brazil",
    "Mexico",
    "Netherlands",
    "Switzerland",
    "Austria",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Belgium",
    "Portugal",
    "Greece",
    "Turkey",
    "Thailand",
    "Singapore",
    "South Korea",
    "New Zealand",
    "Ireland",
    "Czech Republic",
    "Poland",
    "Hungary",
    "Croatia",
    "Slovenia",
    "Estonia",
    "Latvia",
    "Lithuania",
    "Malta",
    "Cyprus",
    "Iceland",
    "Luxembourg",
    "Monaco",
    "Liechtenstein",
    "San Marino",
    "Vatican City",
  ];

  const travelStyles = [
    "Adventure & Active",
    "Luxury & Comfort",
    "Budget & Backpacking",
    "Cultural & Historical",
    "Relaxation & Leisure",
    "Business Travel",
  ];

  const budgetRanges = [
    "$1,000 - $3,000",
    "$3,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $20,000",
    "$20,000+",
  ];

  const interestOptions = [
    "Museums & Art",
    "Food & Cuisine",
    "Nightlife",
    "Nature & Parks",
    "Architecture",
    "Shopping",
    "Music & Festivals",
    "Sports & Adventure",
    "Photography",
    "Local Culture",
    "History",
    "Religion & Spirituality",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "interests") {
        const updatedInterests = checked
          ? [...formData.interests, value]
          : formData.interests.filter((interest) => interest !== value);
        setFormData((prev) => ({ ...prev, interests: updatedInterests }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          profilePhoto: "File size must be less than 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: file,
          profilePhotoPreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setErrors((prev) => ({ ...prev, profilePhoto: "" }));
    }
  };

  const removeProfilePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      profilePhoto: null,
      profilePhotoPreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Step 1 Validation: Account Information
    if (currentStep >= 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Step 2 Validation: Profile Information
    if (currentStep >= 2) {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber =
          "Phone number is required for travel notifications";
      } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Please enter a valid phone number";
      }

      if (!formData.city.trim()) {
        newErrors.city = "City is required for local recommendations";
      }

      if (!formData.country.trim()) {
        newErrors.country = "Country is required for travel planning";
      }
    }

    // Step 3 Validation: Terms acceptance
    if (currentStep >= 3) {
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "You must accept the terms and conditions";
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
      // TODO: Replace with actual API call
      // For demo purposes, simulate successful signup
      setTimeout(() => {
        // Store comprehensive user profile
        localStorage.setItem("token", "demo-token");
        localStorage.setItem(
          "user",
          JSON.stringify({
            // Basic Information
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,

            // Profile Information
            profilePhoto: formData.profilePhotoPreview, // In real app, this would be uploaded to server
            phoneNumber: formData.phoneNumber,
            city: formData.city,
            country: formData.country,

            // Travel Preferences
            additionalInfo: formData.additionalInfo,
            travelStyle: formData.travelStyle,
            budgetRange: formData.budgetRange,
            interests: formData.interests,

            // Metadata
            registeredAt: new Date().toISOString(),
            profileComplete: true,
          })
        );
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setErrors({ general: "Network error. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
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
              <span className="text-sm text-gray-600">Account</span>
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
              <span className="text-sm text-gray-600">Profile</span>
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
        </div>
      </header>

      {/* Registration Form */}
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
              <div className="max-w-2xl mx-auto text-center">
                {currentStep === 1 && (
                  <>
                    <h1 className="text-3xl font-bold mb-2">
                      Create Your Account
                    </h1>
                    <p className="text-blue-100">
                      Let's start with your basic information
                    </p>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h1 className="text-3xl font-bold mb-2">
                      Build Your Travel Profile
                    </h1>
                    <p className="text-blue-100">
                      Help us personalize your experience
                    </p>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h1 className="text-3xl font-bold mb-2">
                      Travel Preferences
                    </h1>
                    <p className="text-blue-100">
                      Tell us about your travel style (optional)
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
                {/* Step 1: Account Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Account Information
                      </h2>
                      <p className="text-gray-600">
                        This information will be used to secure your account and
                        communicate with you about your trips.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.firstName
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.lastName
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Used for account access, trip confirmations, and
                        important travel updates
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Password *
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.password
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="Create a strong password"
                        />
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.confirmPassword
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        Next Step →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Profile Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Profile Information
                      </h2>
                      <p className="text-gray-600">
                        This helps us provide personalized travel
                        recommendations and improve your experience.
                      </p>
                    </div>

                    {/* Profile Photo */}
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Profile Photo (Optional)
                      </label>
                      <div className="flex flex-col items-center">
                        {formData.profilePhotoPreview ? (
                          <div className="relative">
                            <img
                              src={formData.profilePhotoPreview}
                              alt="Profile preview"
                              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={removeProfilePhoto}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                        >
                          {formData.profilePhotoPreview
                            ? "Change Photo"
                            : "Add Photo"}
                        </button>
                      </div>
                      {errors.profilePhoto && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.profilePhoto}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Helps travel partners and local guides recognize you
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.phoneNumber
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="+1 (555) 123-4567"
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phoneNumber}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          For emergency notifications, booking confirmations,
                          and travel updates
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.city ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="Enter your city"
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.city}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Helps us suggest nearby travel options and local
                          experiences
                        </p>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.country ? "border-red-300" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.country}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Required for visa requirements, currency conversion, and
                        travel regulations
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="additionalInfo"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Additional Information (Optional)
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Tell us about dietary restrictions, accessibility needs, travel experience, or anything else that would help us personalize your trips..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Helps us tailor restaurant recommendations,
                        accommodation options, and activity suggestions
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
                        Next Step →
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
                        Help us curate the perfect travel experiences for you
                        (all optional).
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
                        <option value="">Select your travel style</option>
                        {travelStyles.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Influences hotel recommendations, activity suggestions,
                        and itinerary pace
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="budgetRange"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Typical Trip Budget (Optional)
                      </label>
                      <select
                        id="budgetRange"
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select your budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Helps us prioritize accommodation and activity options
                        within your range
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Travel Interests (Optional)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {interestOptions.map((interest) => (
                          <label key={interest} className="flex items-center">
                            <input
                              type="checkbox"
                              name="interests"
                              value={interest}
                              checked={formData.interests.includes(interest)}
                              onChange={handleChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {interest}
                            </span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Used to suggest relevant activities, restaurants, and
                        experiences in each destination
                      </p>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="border-t pt-6">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            target="_blank"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            target="_blank"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      {errors.acceptTerms && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.acceptTerms}
                        </p>
                      )}
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
                            Creating Account...
                          </div>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* Alternative Sign Up Options */}
              {currentStep === 1 && (
                <div className="mt-8 max-w-2xl mx-auto">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                    Continue with Google
                  </button>
                </div>
              )}

              {/* Sign In Link */}
              <div className="mt-8 text-center max-w-2xl mx-auto">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-blue-600 font-medium hover:text-blue-700"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Registration;
