const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const { uploadProfile, uploadPost } = require('../controllers/uploadController');
const { readData } = require('../utils/fileHandler');

const router = express.Router();

// Utility for constructing missing directories explicitly
const ensureDir = (target) => {
    const p = path.join(__dirname, '..', target);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    return target;
};

// --- Profile Storage (Images Only) ---
const profileStorage = multer.diskStorage({
    destination(req, file, cb) { cb(null, ensureDir('uploads/profile')); },
    filename(req, file, cb) { cb(null, `avatar-${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`); }
});
const profileUpload = multer({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Profile avatars strictly require standard image formats.'), false);
    }
});

// --- Post Storage (Images/Videos) ---
const postStorage = multer.diskStorage({
    destination(req, file, cb) { cb(null, ensureDir('uploads/posts')); },
    filename(req, file, cb) { cb(null, `post-${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`); }
});
const postUpload = multer({
    storage: postStorage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Post broadcast requires image or video media binaries.'), false);
        }
    }
});

// Explicit Router Endpoints natively hooking the Controller architectures
router.post('/profile', protect, profileUpload.single('file'), uploadProfile);

// For /post, we add custom video gating check
router.post('/post', protect, postUpload.single('file'), async (req, res, next) => {
    // If it's a video, verify Creator Premium tier
    if (req.file && req.file.mimetype.startsWith('video/')) {
        const users = await readData('users.json');
        const user = users.find(u => u.id === req.user.id);

        if (!user || user.subscription !== 'Creator Premium') {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ 
                message: 'Access Denied. Video broadcasting natively restricted to Creator Premium accounts.' 
            });
        }
    }
    next();
}, uploadPost);

module.exports = router;
