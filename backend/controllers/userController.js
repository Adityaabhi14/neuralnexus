const { readData, writeData } = require('../utils/fileHandler');

// Existing generic profile fetching
exports.getUserProfile = async (req, res) => {
    try {
        const users = await readData('users.json');
        const user = users.find(u => u.name === req.params.username);

        if (!user) return res.status(404).json({ message: 'Identity not found.' });

        const { password, ...safeUser } = user;
        safeUser.followers = Array.isArray(safeUser.followers) ? safeUser.followers : [];
        safeUser.following = Array.isArray(safeUser.following) ? safeUser.following : [];
        // Map legacy subscription to boolean flag dynamically if needed
        safeUser.isPremium = user.isPremium || user.subscription === 'Premium';
        
        res.json(safeUser);
    } catch (error) {
        res.status(500).json({ message: 'Profile retrieval fault.' });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const users = await readData('users.json');
        const user = users.find(u => u.id === req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found.' });

        const { password, ...safeUser } = user;
        safeUser.isPremium = user.isPremium || user.subscription === 'Premium';
        
        res.json(safeUser);
    } catch (error) {
        console.error("Get Current User Error:", error);
        res.status(500).json({ message: 'Server error retrieving user data.' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, profileImage } = req.body;
        const users = await readData('users.json');
        
        const userIndex = users.findIndex(u => u.name === name);
        if (userIndex === -1) return res.status(404).json({ message: 'Identity not found.' });

        users[userIndex].bio = bio || users[userIndex].bio;
        users[userIndex].profileImage = profileImage || users[userIndex].profileImage;

        await writeData('users.json', users);
        const { password, ...safeUser } = users[userIndex];
        res.json(safeUser);
    } catch (error) {
        res.status(500).json({ message: 'Profile update fault natively.' });
    }
};

// Explicit ID-based Follow Engine
exports.followUser = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const targetId = req.params.id;

        if (currentUserId === targetId) {
            return res.status(400).json({ message: 'Self-follow strictly prohibited.' });
        }

        const users = await readData('users.json');
        const currentUserIndex = users.findIndex(u => u.id === currentUserId);
        const targetUserIndex = users.findIndex(u => u.id === targetId);

        if (currentUserIndex === -1 || targetUserIndex === -1) {
            return res.status(404).json({ message: 'Identities unresolved natively.' });
        }

        let currentUser = users[currentUserIndex];
        let targetUser = users[targetUserIndex];

        currentUser.following = Array.isArray(currentUser.following) ? currentUser.following : [];
        targetUser.followers = Array.isArray(targetUser.followers) ? targetUser.followers : [];

        if (currentUser.following.includes(targetId)) {
            return res.status(400).json({ message: 'Duplicate constraint: Already following.' });
        }

        currentUser.following.push(targetId);
        targetUser.followers.push(currentUserId);

        await writeData('users.json', users);
        res.json({ message: 'Successfully followed target matrix.' });
    } catch (error) {
        res.status(500).json({ message: 'Social matrix follow crash.' });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const targetId = req.params.id;

        const users = await readData('users.json');
        const currentUserIndex = users.findIndex(u => u.id === currentUserId);
        const targetUserIndex = users.findIndex(u => u.id === targetId);

        if (currentUserIndex === -1 || targetUserIndex === -1) {
            return res.status(404).json({ message: 'Identities unresolved.' });
        }

        let currentUser = users[currentUserIndex];
        let targetUser = users[targetUserIndex];

        currentUser.following = Array.isArray(currentUser.following) ? currentUser.following : [];
        targetUser.followers = Array.isArray(targetUser.followers) ? targetUser.followers : [];

        currentUser.following = currentUser.following.filter(id => id !== targetId);
        targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);

        await writeData('users.json', users);
        res.json({ message: 'Successfully severed target connection.' });
    } catch (error) {
        res.status(500).json({ message: 'Social matrix unfollow crash.' });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const targetId = req.params.id;
        const users = await readData('users.json');
        const targetUser = users.find(u => u.id === targetId);

        if (!targetUser) return res.status(404).json({ message: 'Identity offline.' });

        const safeFollowers = Array.isArray(targetUser.followers) ? targetUser.followers : [];
        const populated = users.filter(u => safeFollowers.includes(u.id))
                               .map(({ password, ...safe }) => safe);

        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Failed fetching follower structures.' });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const targetId = req.params.id;
        const users = await readData('users.json');
        const targetUser = users.find(u => u.id === targetId);

        if (!targetUser) return res.status(404).json({ message: 'Identity offline.' });

        const safeFollowing = Array.isArray(targetUser.following) ? targetUser.following : [];
        const populated = users.filter(u => safeFollowing.includes(u.id))
                               .map(({ password, ...safe }) => safe);

        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Failed fetching following structures.' });
    }
};

exports.getSuggestions = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const users = await readData('users.json');
        
        const currentUser = users.find(u => u.id === currentUserId);
        if (!currentUser) return res.status(404).json({ message: 'Current identity missing.' });

        const following = Array.isArray(currentUser.following) ? currentUser.following : [];

        // Exclude self and already followed
        const suggestions = users.filter(u => u.id !== currentUserId && !following.includes(u.id))
                                 .map(({ password, ...safe }) => safe)
                                 .slice(0, 5); // Return max 5 natively

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: 'Failed algorithm mapping suggestions.' });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query || !query.trim()) {
            return res.json([]);
        }

        const lowerQuery = query.trim().toLowerCase();
        const users = await readData('users.json');

        const results = users
            .filter(u => u.name && u.name.toLowerCase().includes(lowerQuery))
            .map(u => ({
                id: u.id,
                name: u.name,
                profileImage: u.profileImage || '',
                followersCount: Array.isArray(u.followers) ? u.followers.length : 0
            }))
            .slice(0, 15); // Explicit limit matching Instagram search limits roughly

        res.json(results);
    } catch (error) {
        console.error("User Search Algorithm Crash:", error);
        res.status(500).json({ message: 'User search failure natively.' });
    }
};
