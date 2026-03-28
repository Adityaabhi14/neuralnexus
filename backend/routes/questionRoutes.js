const express = require("express");
const { 
  getQuestions, 
  getQuestionById, 
  createQuestion, 
  upvoteQuestion 
} = require("../controllers/questionController");

const router = express.Router();

router.route("/")
  .get(getQuestions)
  .post(createQuestion);

router.route("/:id")
  .get(getQuestionById);

router.route("/:id/upvote")
  .patch(upvoteQuestion);

module.exports = router;
