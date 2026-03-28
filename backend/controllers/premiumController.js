const { readData, writeData } = require('../utils/fileHandler');

exports.upgradeToPremium = async (req, res) => {
    try {
        const userId = req.user.id;
        const users = await readData('users.json');
        
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'Identity not found.' });
        }

        // Set simulated premium status
        users[userIndex].isPremium = true;
        // Optionally update the existing subscription field for backwards compat
        users[userIndex].subscription = 'Premium';

        await writeData('users.json', users);

        res.json({ 
            message: 'Successfully upgraded to premium.',
            isPremium: true
        });
    } catch (error) {
        console.error('Premium upgrade error:', error);
        res.status(500).json({ message: 'Failed to process premium upgrade.' });
    }
};
