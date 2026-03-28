const crypto = require('crypto');
const { readData, writeData } = require('../utils/fileHandler');

// @desc    Get all questions (sorted latest first, with answer counts)
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const questions = await readData('questions.json');
    const answers = await readData('answers.json');

    // Attach answer counts and sort descending by createdAt
    const enrichedQuestions = questions.map(q => {
      const answerCount = answers.filter(a => a.questionId === q.id).length;
      return { ...q, answerCount };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(enrichedQuestions);
  } catch (error) {
    console.error('getQuestions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single question by id
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = async (req, res) => {
  try {
    const questions = await readData('questions.json');
    const question = questions.find(q => q.id === req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error('getQuestionById error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Public
const createQuestion = async (req, res) => {
  try {
    const { title, body, author } = req.body;

    // Strict validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Please provide a valid title' });
    }
    if (!body || body.trim() === '') {
      return res.status(400).json({ message: 'Please provide a valid question body content' });
    }
    if (!author) {
      return res.status(400).json({ message: 'Please provide an author to associate with the question' });
    }

    const questions = await readData('questions.json');

    const newQuestion = {
      id: crypto.randomUUID(),
      title: title.trim(),
      body: body.trim(),
      author,
      upvotes: 0,
      createdAt: new Date().toISOString()
    };

    questions.push(newQuestion);
    await writeData('questions.json', questions);

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('createQuestion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upvote a question
// @route   PATCH /api/questions/:id/upvote
// @access  Public
const upvoteQuestion = async (req, res) => {
  try {
    const questions = await readData('questions.json');
    const questionIndex = questions.findIndex(q => q.id === req.params.id);

    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Initialize if undefined for old data, then increment
    questions[questionIndex].upvotes = (questions[questionIndex].upvotes || 0) + 1;
    
    await writeData('questions.json', questions);

    res.status(200).json(questions[questionIndex]);
  } catch (error) {
    console.error('upvoteQuestion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  upvoteQuestion
};
