const crypto = require('crypto');
const { readData, writeData } = require('../utils/fileHandler');

// @desc    Get user profile with populated stats
// @route   GET /api/users/profile/:username
const getUserProfile = async (req, res) => {
  try {
    const users = await readData('users.json');
    const user = users.find(u => u.name === req.params.username);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Safe destructure omitting passwords natively securely
    const { password, ...safeUser } = user;
    
    // Ensure arrays exist
    if (!Array.isArray(safeUser.followers)) safeUser.followers = [];
    if (!Array.isArray(safeUser.following)) safeUser.following = [];

    res.status(200).json(safeUser);
  } catch (error) {
    res.status(500).json({ message: 'Server fault mapping profile', error: error.message });
  }
};

// @desc    Update user profile data
// @route   PATCH /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, profileImage } = req.body;
    
    if (!name) return res.status(400).json({ message: 'Name reference identifier mapping missing' });

    const users = await readData('users.json');
    const idx = users.findIndex(u => u.name === name);

    if (idx === -1) return res.status(404).json({ message: 'Account not found rendering identity constraint' });

    if (bio !== undefined) users[idx].bio = bio.trim();
    if (profileImage !== undefined) users[idx].profileImage = profileImage.trim();

    await writeData('users.json', users);
    
    const { password, ...updatedUser } = users[idx];
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Profile rewrite failed.', error: error.message });
  }
};

// @desc    Follow / Unfollow a user
// @route   PATCH /api/users/follow
const followUser = async (req, res) => {
  try {
    const { currentUsername, targetUsername } = req.body;
    if (!currentUsername || !targetUsername || currentUsername === targetUsername) {
      return res.status(400).json({ message: 'Invalid follow targets.' });
    }

    const users = await readData('users.json');
    const currIdx = users.findIndex(u => u.name === currentUsername);
    const tgIdx = users.findIndex(u => u.name === targetUsername);

    if (currIdx === -1 || tgIdx === -1) return res.status(404).json({ message: 'Users missing' });

    if (!Array.isArray(users[currIdx].following)) users[currIdx].following = [];
    if (!Array.isArray(users[tgIdx].followers)) users[tgIdx].followers = [];

    const isFollowing = users[currIdx].following.includes(targetUsername);

    if (isFollowing) {
        // Unfollow
        users[currIdx].following = users[currIdx].following.filter(n => n !== targetUsername);
        users[tgIdx].followers = users[tgIdx].followers.filter(n => n !== currentUsername);
    } else {
        // Follow
        users[currIdx].following.push(targetUsername);
        users[tgIdx].followers.push(currentUsername);
    }

    await writeData('users.json', users);

    res.status(200).json({ 
        following: users[currIdx].following, 
        isFollowing: !isFollowing,
        targetFollowersCount: users[tgIdx].followers.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error processing follow.', error: error.message });
  }
};

// @desc    Get all users for Chat/Messaging
// @route   GET /api/users
const getAllUsers = async (req, res) => {
    try {
        const users = await readData('users.json');
        const lists = users.map(u => ({ id: u.id, name: u.name, profileImage: u.profileImage, role: u.role || 'user' }));
        res.status(200).json(lists);
    } catch {
        res.status(500).json({ message: 'Server failed retrieving users list.' });
    }
}

module.exports = { getUserProfile, updateProfile, followUser, getAllUsers };
