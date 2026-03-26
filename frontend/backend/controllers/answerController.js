const Answer = require("../models/Answer");
const Question = require("../models/Question");
const cloudinary = require("../config/cloudinary");
const { generateAnswerSuggestion } = require("../utils/ai");

// POST /answers — Creator submits an answer (text and/or video)
const createAnswer = async (req, res) => {
  try {
    const { questionId, creatorId, textAnswer } = req.body;
    let videoUrl = null;

    // If a video file was uploaded, send it to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "fancreator_videos" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      videoUrl = result.secure_url;
    }

    const answer = await Answer.create({
      questionId,
      creatorId,
      textAnswer,
      videoUrl,
    });

    // Mark the question as answered
    await Question.findByIdAndUpdate(questionId, { status: "answered" });

    // AI: generate a suggestion the creator can reference
    const question = await Question.findById(questionId);
    const aiSuggestion = question
      ? generateAnswerSuggestion(question.questionText)
      : null;

    res.status(201).json({ answer, aiSuggestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAnswer };
