const express = require('express');
const { 
    getUserProfile, 
    getCurrentUser,
    updateProfile, 
    followUser, 
    unfollowUser, 
    getFollowers, 
    getFollowing, 
    getSuggestions,
    searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Search MUST come before parameter routes like /:id to prevent collision
router.get('/search', protect, searchUsers);

// Public / Semi-public mapped Profile routes
router.get('/me', protect, getCurrentUser);
router.get('/profile/:username', getUserProfile);
router.patch('/profile', protect, updateProfile);

// Explicit Auth Protected Array Network Routes
router.get('/suggestions', protect, getSuggestions);

router.patch('/:id/follow', protect, followUser);
router.patch('/:id/unfollow', protect, unfollowUser);
router.get('/:id/followers', protect, getFollowers);
router.get('/:id/following', protect, getFollowing);

module.exports = router;
