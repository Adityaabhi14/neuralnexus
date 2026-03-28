const crypto = require('crypto');
const { readData, writeData } = require('../utils/fileHandler');

// @desc    Get all answers
// @route   GET /api/answers
// @access  Public
const getAnswers = async (req, res) => {
  try {
    const answers = await readData('answers.json');
    res.status(200).json(answers);
  } catch (error) {
    console.error('getAnswers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get answers for a specific question
// @route   GET /api/answers/:questionId
// @access  Public
const getAnswersByQuestionId = async (req, res) => {
  try {
    const answers = await readData('answers.json');
    const filteredAnswers = answers.filter((ans) => ans.questionId === req.params.questionId);
    
    res.status(200).json(filteredAnswers);
  } catch (error) {
    console.error('getAnswersByQuestionId error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// @desc    Create a new answer
// @route   POST /api/answers
// @access  Public
const createAnswer = async (req, res) => {
  try {
    const { questionId, text, author } = req.body;

    // Strict validation
    if (!questionId) {
      return res.status(400).json({ message: 'Please provide a valid questionId' });
    }
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Please provide valid answer text content' });
    }
    if (!author) {
      return res.status(400).json({ message: 'Please provide an author to associate with the answer' });
    }

    const answers = await readData('answers.json');

    const newAnswer = {
      id: crypto.randomUUID(),
      questionId,
      text: text.trim(),
      author,
      createdAt: new Date().toISOString()
    };

    answers.push(newAnswer);
    await writeData('answers.json', answers);

    res.status(201).json(newAnswer);
  } catch (error) {
    console.error('createAnswer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAnswers,
  getAnswersByQuestionId,
  createAnswer,
};
