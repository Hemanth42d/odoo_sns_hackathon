require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const itineraryRoutes = require("./routes/itinerary");
const activityRoutes = require("./routes/activities");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GlobeTrotter API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      trips: "/api/trips",
      itinerary: "/api/trips/:tripId/itinerary",
      activities: "/api/trips/:tripId/itinerary/stops/:stopId/activities",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trips/:tripId/itinerary", itineraryRoutes);
app.use(
  "/api/trips/:tripId/itinerary/stops/:stopId/activities",
  activityRoutes
);

app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

process.on("SIGINT", () => {
  console.log("Received SIGINT. Gracefully shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Gracefully shutting down...");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});
