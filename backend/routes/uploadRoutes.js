const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads folder exists securely
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    }
});

// Explicit filter validating image formats structurally mapping the UI goals
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only explicit image formats are permitted.'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

const profileUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for profile avatars
    fileFilter: imageFilter
});

// @desc    Upload generic post media
// @route   POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file transmitted.' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl, filename: req.file.originalname });
});

// @desc    Upload profile avatar image
// @route   POST /api/upload/profile
router.post('/profile', profileUpload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No image file transmitted.' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl, filename: req.file.originalname });
});

module.exports = router;
