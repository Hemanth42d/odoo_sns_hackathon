const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "sightseeing",
        "food",
        "adventure",
        "culture",
        "shopping",
        "relaxation",
        "transport",
        "other",
      ],
      default: "sightseeing",
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    bookingRequired: {
      type: Boolean,
      default: false,
    },
    bookingDetails: {
      url: String,
      confirmationNumber: String,
      notes: String,
    },
    notes: {
      type: String,
      default: "",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    photos: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AccommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["hotel", "hostel", "airbnb", "guesthouse", "resort", "other"],
      default: "hotel",
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    bookingDetails: {
      url: String,
      confirmationNumber: String,
      notes: String,
    },
    amenities: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    photos: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const StopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    accommodation: AccommodationSchema,
    dailyBudget: {
      type: Number,
      default: 100,
      min: 0,
    },
    totalBudget: {
      type: Number,
      default: 0,
      min: 0,
    },
    spentBudget: {
      type: Number,
      default: 0,
      min: 0,
    },
    activities: [ActivitySchema],
    transportation: {
      to: {
        method: {
          type: String,
          enum: ["flight", "train", "bus", "car", "boat", "other"],
        },
        cost: {
          type: Number,
          min: 0,
        },
        duration: String,
        bookingDetails: {
          url: String,
          confirmationNumber: String,
          notes: String,
        },
      },
      from: {
        method: {
          type: String,
          enum: ["flight", "train", "bus", "car", "boat", "other"],
        },
        cost: {
          type: Number,
          min: 0,
        },
        duration: String,
        bookingDetails: {
          url: String,
          confirmationNumber: String,
          notes: String,
        },
      },
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    notes: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    weather: {
      temperature: {
        high: Number,
        low: Number,
      },
      description: String,
      humidity: Number,
    },
  },
  {
    timestamps: true,
  }
);

const TripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    numberOfTravelers: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    theme: {
      type: String,
      enum: [
        "adventure",
        "cultural",
        "relaxation",
        "business",
        "romantic",
        "family",
        "solo",
        "foodie",
      ],
    },
    travelStyle: {
      type: String,
      enum: ["budget", "comfort", "luxury", "backpacker", "business"],
      default: "comfort",
    },
    interests: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["planning", "active", "completed", "cancelled"],
      default: "planning",
    },
    progress: {
      destinations: {
        type: Number,
        default: 0,
      },
      accommodations: {
        type: Number,
        default: 0,
      },
      activities: {
        type: Number,
        default: 0,
      },
      transportation: {
        type: Number,
        default: 0,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },

    itinerary: {
      stops: [StopSchema],
    },

    budgetTracking: {
      totalBudget: {
        type: Number,
        default: 0,
        min: 0,
      },
      spent: {
        type: Number,
        default: 0,
        min: 0,
      },
      categories: {
        accommodation: {
          type: Number,
          default: 0,
        },
        transportation: {
          type: Number,
          default: 0,
        },
        food: {
          type: Number,
          default: 0,
        },
        activities: {
          type: Number,
          default: 0,
        },
        shopping: {
          type: Number,
          default: 0,
        },
        other: {
          type: Number,
          default: 0,
        },
      },
    },

    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["owner", "editor", "viewer"],
          default: "viewer",
        },
        permissions: [
          {
            type: String,
            enum: ["edit", "delete", "invite", "view"],
          },
        ],
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isPublic: {
      type: Boolean,
      default: false,
    },
    shareUrl: {
      type: String,
      unique: true,
      sparse: true,
    },

    tags: [
      {
        type: String,
      },
    ],
    photos: [
      {
        url: String,
        caption: String,
        location: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shares: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
        filename: String,
        size: Number,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    budget: {
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
      spent: {
        type: Number,
        default: 0,
        min: 0,
      },
      breakdown: {
        accommodation: { type: Number, default: 0 },
        transportation: { type: Number, default: 0 },
        food: { type: Number, default: 0 },
        activities: { type: Number, default: 0 },
        shopping: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

TripSchema.index({ owner: 1, status: 1 });
TripSchema.index({ startDate: 1, endDate: 1 });
TripSchema.index({ "collaborators.user": 1 });
TripSchema.index({ isPublic: 1, likes: -1 });

TripSchema.virtual("remainingBudget").get(function () {
  return this.budgetTracking.totalBudget - this.budgetTracking.spent;
});

TripSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  next();
});

StopSchema.pre("save", function (next) {
  if (this.arrivalDate && this.departureDate) {
    const diffTime = Math.abs(this.departureDate - this.arrivalDate);
    this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const accommodationCost =
    this.accommodation && this.accommodation.totalCost
      ? this.accommodation.totalCost
      : 0;
  const dailyCost = this.dailyBudget * this.duration;
  const activitiesCost = this.activities.reduce(
    (sum, activity) => sum + (activity.cost || 0),
    0
  );

  this.totalBudget = accommodationCost + dailyCost + activitiesCost;
  next();
});

module.exports = mongoose.model("Trip", TripSchema);
