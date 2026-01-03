const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

const uploadDir = process.env.UPLOAD_PATH || "./uploads";
const maxSize = parseInt(process.env.UPLOAD_MAX_SIZE) || 10485760; // 10MB default

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter,
});

// Process and save image
const processImage = async (buffer, filename, options = {}) => {
  await ensureUploadDir();

  const { width = 800, height = 600, quality = 80, format = "jpeg" } = options;

  const processedBuffer = await sharp(buffer)
    .resize(width, height, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality })
    .toBuffer();

  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, processedBuffer);

  return {
    filename,
    path: filepath,
    size: processedBuffer.length,
  };
};

// Generate unique filename
const generateFilename = (originalName, prefix = "") => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalName);
  return `${prefix}${timestamp}-${random}${extension}`;
};

// Upload single image
const uploadSingle = (fieldName) => upload.single(fieldName);

// Upload multiple images
const uploadMultiple = (fieldName, maxCount = 10) =>
  upload.array(fieldName, maxCount);

// Delete file
const deleteFile = async (filename) => {
  try {
    const filepath = path.join(uploadDir, filename);
    await fs.unlink(filepath);
    return true;
  } catch (error) {
    console.error("Delete file error:", error);
    return false;
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  processImage,
  generateFilename,
  deleteFile,
  ensureUploadDir,
};
