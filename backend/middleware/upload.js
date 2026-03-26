const multer = require("multer");
const path = require("path");

// Store files in memory (we upload to Cloudinary, not disk)
const storage = multer.memoryStorage();

// Only allow video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|mkv|webm/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = file.mimetype.startsWith("video/");

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed (mp4, mov, avi, mkv, webm)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
});

module.exports = upload;
