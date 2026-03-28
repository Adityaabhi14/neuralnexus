const { readData, writeData } = require('../utils/fileHandler');
const crypto = require('crypto');

exports.createPost = async (req, res) => {
    try {
        const { content = '', mediaUrl = '' } = req.body;
        const userId = req.user.id;

        if (!content.trim() && !mediaUrl.trim()) {
            return res.status(400).json({ message: 'Post must contain valid text or media payload.' });
        }

        const posts = await readData('posts.json');

        const newPost = {
            id: crypto.randomUUID(),
            userId,
            content: content.trim(),
            mediaUrl: mediaUrl.trim(),
            likes: [],
            comments: [],
            createdAt: new Date().toISOString()
        };

        posts.push(newPost);
        await writeData('posts.json', posts);

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Native Feed Generation Fault:", error);
        res.status(500).json({ message: 'Failed writing Post payload natively.' });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await readData('posts.json');
        
        // Ensure atomic sorting mappings
        const sorted = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(sorted);
    } catch (error) {
        res.status(500).json({ message: 'Failed fetching Neural Feeds.' });
    }
};

exports.getFeed = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const users = await readData('users.json');
        const currentUser = users.find(u => u.id === currentUserId);
        
        if (!currentUser) return res.status(404).json({ message: 'Identity offline.' });

        const following = Array.isArray(currentUser.following) ? currentUser.following : [];
        if (following.length === 0) return res.json([]); // Return explicit zero array gracefully!

        const posts = await readData('posts.json');
        const feedPosts = posts.filter(p => following.includes(p.userId) || p.userId === currentUserId);
        
        const sorted = feedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(sorted);
    } catch (error) {
        res.status(500).json({ message: 'Failed fetching targeted Node Feed.' });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await readData('posts.json');
        
        const userPosts = posts.filter(p => p.userId === userId);
        const sorted = userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        res.json(sorted); // Frontends iterating natively
    } catch (error) {
        res.status(500).json({ message: 'Failed locating contextual profile broadcasts.' });
    }
};

exports.commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.id;
        
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment payload unresolved.' });
        }

        const posts = await readData('posts.json');
        const postIndex = posts.findIndex(p => p.id === req.params.id);
        
        if (postIndex === -1) {
            return res.status(404).json({ message: 'Target broadcast offline.' });
        }

        const newComment = {
            userId,
            text: text.trim(),
            createdAt: new Date().toISOString()
        };

        posts[postIndex].comments = Array.isArray(posts[postIndex].comments) ? posts[postIndex].comments : [];
        posts[postIndex].comments.push(newComment);

        await writeData('posts.json', posts);
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Comment Insertion Failure:", error);
        res.status(500).json({ message: 'Comment insertion failure.' });
    }
};

exports.likePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await readData('posts.json');
        
        const postIndex = posts.findIndex(p => p.id === req.params.id);
        if (postIndex === -1) {
            return res.status(404).json({ message: 'Target broadcast offline.' });
        }

        const post = posts[postIndex];
        post.likes = Array.isArray(post.likes) ? post.likes : [];

        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            post.likes.push(userId);
        }

        await writeData('posts.json', posts);
        res.json({ message: hasLiked ? 'Post unliked' : 'Post liked', likes: post.likes });
    } catch (error) {
        console.error("Native Like Algorithm Error:", error);
        res.status(500).json({ message: 'Like resolution crash.' });
    }
};

exports.searchPosts = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query || !query.trim()) {
            return res.json([]);
        }

        const lowerQuery = query.trim().toLowerCase();
        const posts = await readData('posts.json');

        const results = posts
            .filter(p => p.content && p.content.toLowerCase().includes(lowerQuery))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 15);

        res.json(results);
    } catch (error) {
        console.error("Post Search Engine Crash:", error);
        res.status(500).json({ message: 'Post search failure.' });
    }
};
