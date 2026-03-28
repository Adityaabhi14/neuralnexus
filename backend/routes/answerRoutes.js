const express = require("express");
const { getAnswers, getAnswersByQuestionId, createAnswer } = require("../controllers/answerController");

const router = express.Router();

router.route("/")
  .get(getAnswers)
  .post(createAnswer);

router.route("/:questionId")
  .get(getAnswersByQuestionId);

module.exports = router;
