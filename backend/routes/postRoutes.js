const express = require('express');
const { createPost, getPosts, getUserPosts, commentOnPost, likePost, getFeed, searchPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/search', searchPosts);
router.post('/', protect, createPost);
router.get('/feed', protect, getFeed);
router.get('/', getPosts);
router.get('/:userId', getUserPosts);
router.post('/:id/comment', protect, commentOnPost);
router.patch('/:id/like', protect, likePost);

module.exports = router;
