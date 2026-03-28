const crypto = require('crypto');
const { readData, writeData } = require('../utils/fileHandler');

// @desc    Get conversation history between currUser and targetUser
// @route   GET /api/messages/:userA/:userB
const getConversation = async (req, res) => {
  try {
    const { userA, userB } = req.params;
    const messages = await readData('messages.json');
    
    // Filter out specific chat bounds safely
    const thread = messages.filter(m => 
      (m.senderId === userA && m.receiverId === userB) ||
      (m.senderId === userB && m.receiverId === userA)
    ).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Message thread mapped exception.', error: error.message });
  }
};

// @desc    Send DM
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    if (!senderId || !receiverId || !text?.trim()) {
      return res.status(400).json({ message: 'Invalid message payload constraint' });
    }

    const messages = await readData('messages.json');
    const newMsg = {
      id: crypto.randomUUID(),
      senderId,
      receiverId,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    messages.push(newMsg);
    await writeData('messages.json', messages);

    res.status(201).json(newMsg);
  } catch (error) {
    res.status(500).json({ message: 'Server error sending message', error: error.message });
  }
};

module.exports = { getConversation, sendMessage };
