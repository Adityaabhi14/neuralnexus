const Question = require("../models/Question");
const { improveQuestion } = require("../utils/ai");

// POST /questions — Fan submits a question to a creator
const createQuestion = async (req, res) => {
  try {
    const { userId, creatorId, questionText } = req.body;

    // AI: generate an improved version of the question
    const improvedText = improveQuestion(questionText);

    const question = await Question.create({
      userId,
      creatorId,
      questionText,
      improvedText,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /questions — Fetch all questions (with user & creator info)
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("userId", "name email avatar")
      .populate("creatorId", "name email avatar")
      .sort({ createdAt: -1 }); // Newest first

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /questions/:id/upvote — Upvote a question
const upvoteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // No auth yet, so userId comes from body

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Prevent duplicate voting
    if (question.voters.includes(userId)) {
      return res.status(400).json({ error: "You have already upvoted this question" });
    }

    // Add voter and increment upvotes
    question.voters.push(userId);
    question.upvotes += 1;

    // Simple score: upvotes + recency bonus (newer = higher bonus)
    const ageInHours = (Date.now() - question.createdAt) / (1000 * 60 * 60);
    question.score = question.upvotes + Math.max(0, 10 - ageInHours);

    await question.save();

    res.json({ upvotes: question.upvotes, score: question.score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /questions/top — Get top-ranked questions
const getTopQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("userId", "name email avatar")
      .populate("creatorId", "name email avatar")
      .sort({ score: -1, createdAt: -1 }) // Highest score first, then newest
      .limit(20);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createQuestion, getAllQuestions, upvoteQuestion, getTopQuestions };
