const express = require("express");
const { auth } = require("../middleware/auth");
const { uploadLimit } = require("../middleware/rateLimiter");
const {
  uploadSingle,
  uploadMultiple,
  processImage,
  generateFilename,
  deleteFile,
} = require("../middleware/upload");
const User = require("../Models/User");
const Trip = require("../Models/Trip");

const router = express.Router();

// Upload profile picture
router.post(
  "/profile-picture",
  [auth, uploadLimit, uploadSingle("profilePicture")],
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Generate filename and process image
      const filename = generateFilename(req.file.originalname, "profile-");
      const result = await processImage(req.file.buffer, filename, {
        width: 300,
        height: 300,
        quality: 90,
      });

      // Update user's profile picture
      const oldProfilePicture = req.user.profilePicture;
      await User.findByIdAndUpdate(req.user._id, {
        profilePicture: `/uploads/${filename}`,
      });

      // Delete old profile picture if exists
      if (oldProfilePicture && oldProfilePicture.startsWith("/uploads/")) {
        const oldFilename = oldProfilePicture.replace("/uploads/", "");
        await deleteFile(oldFilename);
      }

      res.json({
        success: true,
        message: "Profile picture updated successfully",
        data: {
          profilePicture: `/uploads/${filename}`,
          fileSize: result.size,
        },
      });
    } catch (error) {
      console.error("Upload profile picture error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during file upload",
      });
    }
  }
);

// Upload trip images
router.post(
  "/trip/:tripId/images",
  [auth, uploadLimit, uploadMultiple("images", 10)],
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      // Check if user owns the trip or has edit permission
      const trip = await Trip.findById(req.params.tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      const isOwner = trip.owner.toString() === req.user._id.toString();
      const collaborator = trip.collaborators.find(
        (collab) => collab.user.toString() === req.user._id.toString()
      );
      const hasEditPermission =
        isOwner || (collaborator && collaborator.permissions.includes("edit"));

      if (!hasEditPermission) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions to upload images",
        });
      }

      // Process all images
      const uploadPromises = req.files.map(async (file) => {
        const filename = generateFilename(file.originalname, "trip-");
        const result = await processImage(file.buffer, filename, {
          width: 1200,
          height: 800,
          quality: 85,
        });

        return {
          url: `/uploads/${filename}`,
          filename: result.filename,
          size: result.size,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // Add images to trip
      const currentImages = trip.images || [];
      const updatedImages = [...currentImages, ...uploadedImages];

      await Trip.findByIdAndUpdate(req.params.tripId, {
        images: updatedImages,
      });

      res.json({
        success: true,
        message: "Images uploaded successfully",
        data: {
          images: uploadedImages,
          totalImages: updatedImages.length,
        },
      });
    } catch (error) {
      console.error("Upload trip images error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during file upload",
      });
    }
  }
);

// Delete trip image
router.delete("/trip/:tripId/images/:filename", [auth], async (req, res) => {
  try {
    const { tripId, filename } = req.params;

    // Check if user owns the trip or has edit permission
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const isOwner = trip.owner.toString() === req.user._id.toString();
    const collaborator = trip.collaborators.find(
      (collab) => collab.user.toString() === req.user._id.toString()
    );
    const hasEditPermission =
      isOwner || (collaborator && collaborator.permissions.includes("edit"));

    if (!hasEditPermission) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions to delete images",
      });
    }

    // Remove image from trip
    const updatedImages = (trip.images || []).filter(
      (image) => !image.url.includes(filename)
    );

    await Trip.findByIdAndUpdate(tripId, {
      images: updatedImages,
    });

    // Delete physical file
    await deleteFile(filename);

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete trip image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting image",
    });
  }
});

// Serve uploaded files (static file serving)
router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const path = require("path");
  const uploadDir = process.env.UPLOAD_PATH || "./uploads";

  res.sendFile(path.resolve(uploadDir, filename), (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
    }
  });
});

module.exports = router;
