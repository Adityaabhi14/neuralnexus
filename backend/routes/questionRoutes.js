const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  upvoteQuestion,
  getTopQuestions,
} = require("../controllers/questionController");

// GET /api/questions/top — Top-ranked questions (must be BEFORE /:id routes)
router.get("/top", getTopQuestions);

// POST /api/questions — Submit a new question
router.post("/", createQuestion);

// GET /api/questions — Get all questions
router.get("/", getAllQuestions);

// POST /api/questions/:id/upvote — Upvote a question
router.post("/:id/upvote", upvoteQuestion);

module.exports = router;
