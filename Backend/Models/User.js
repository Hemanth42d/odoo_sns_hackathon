const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    dateOfBirth: {
      type: Date,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    preferences: {
      currency: {
        type: String,
        default: "USD",
      },
      language: {
        type: String,
        default: "en",
      },
      timeZone: {
        type: String,
        default: "UTC",
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
    },
    statistics: {
      totalTrips: {
        type: Number,
        default: 0,
      },
      totalCountries: {
        type: Number,
        default: 0,
      },
      totalCities: {
        type: Number,
        default: 0,
      },
      totalSpent: {
        type: Number,
        default: 0,
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });

module.exports = mongoose.model("User", UserSchema);
