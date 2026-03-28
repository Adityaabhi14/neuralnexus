const crypto = require('crypto');
const { readData, writeData } = require('../utils/fileHandler');

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res) => {
  try {
    const posts = await readData('posts.json');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server fault reading posts', error: error.message });
  }
};

// @desc    Get posts by specific user profile
// @route   GET /api/posts/profile/:author
const getProfilePosts = async (req, res) => {
  try {
    const posts = await readData('posts.json');
    const userPosts = posts.filter(p => p.author === req.params.author).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ posts: userPosts });
  } catch (error) {
    res.status(500).json({ message: 'Profile network parsing failed.', error: error.message });
  }
};

// @desc    Create new creator post
// @route   POST /api/posts
const createPost = async (req, res) => {
  try {
    const { title, content, mediaUrl, author } = req.body;
    
    if (!content && !mediaUrl) {
        return res.status(400).json({ message: 'Post must contain content or media' });
    }

    const posts = await readData('posts.json');
    const newPost = {
        id: crypto.randomUUID(),
        title,
        content,
        mediaUrl,
        author: author || 'Anonymous',
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    await writeData('posts.json', posts);

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server fault writing post', error: error.message });
  }
};

// @desc    Like a post
// @route   PATCH /api/posts/:id/like
const likePost = async (req, res) => {
  try {
    const posts = await readData('posts.json');
    const idx = posts.findIndex(p => p.id === req.params.id);
    
    if (idx === -1) return res.status(404).json({ message: 'Post vanished' });
    
    posts[idx].likes = (posts[idx].likes || 0) + 1;
    await writeData('posts.json', posts);

    res.status(200).json({ message: 'Liked', likes: posts[idx].likes });
  } catch (error) {
    res.status(500).json({ message: 'Failed processing like', error: error.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
const commentPost = async (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required.' });

    const posts = await readData('posts.json');
    const idx = posts.findIndex(p => p.id === req.params.id);
    
    if (idx === -1) return res.status(404).json({ message: 'Post not found for commenting' });
    
    if (!Array.isArray(posts[idx].comments)) posts[idx].comments = [];
    
    const newComment = {
        id: crypto.randomUUID(),
        author: author || 'Anonymous',
        text,
        createdAt: new Date().toISOString()
    };

    posts[idx].comments.push(newComment);
    await writeData('posts.json', posts);

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error processing comment', error: error.message });
  }
}

module.exports = { getPosts, getProfilePosts, createPost, likePost, commentPost };
