const { readData, writeData } = require('../utils/fileHandler');

// @desc    Upload profile avatar image
// @route   POST /api/upload/profile
exports.uploadProfile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file transmitted.' });
    }

    try {
        // Build accessible URL unconditionally
        const fileUrl = `http://localhost:5000/uploads/profile/${req.file.filename}`;

        // Map strictly to users.json locally securely replacing fake URLs
        const users = await readData('users.json');
        const userIndex = users.findIndex(u => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Identity missing from local matrix.' });
        }

        users[userIndex].profileImage = fileUrl;
        await writeData('users.json', users);

        res.status(201).json({ url: fileUrl, message: 'Profile Avatar cleanly integrated globally.' });
    } catch (error) {
        console.error("Profile Upload Fault:", error);
        res.status(500).json({ message: 'Failed native profile upload saving sequence.' });
    }
};

// @desc    Upload generic post media (Images/Videos)
// @route   POST /api/upload/post
exports.uploadPost = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No media file transmitted.' });
    }

    try {
        const fileUrl = `http://localhost:5000/uploads/posts/${req.file.filename}`;

        res.status(201).json({ 
            url: fileUrl, 
            message: 'Media securely mounted to broadcast network.' 
        });
    } catch (error) {
        console.error("Post Upload Fault:", error);
        res.status(500).json({ message: 'Failed post media generation sequence.' });
    }
};
