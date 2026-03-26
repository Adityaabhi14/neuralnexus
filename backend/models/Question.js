const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // The fan who asked the question
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // The creator the question is directed to
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  improvedText: {
    type: String, // AI-improved version of the question (filled later)
  },
  status: {
    type: String,
    enum: ["pending", "answered"],
    default: "pending",
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Users who have upvoted (prevents duplicates)
    },
  ],
  score: {
    type: Number,
    default: 0, // Ranking score based on upvotes + recency
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", questionSchema);
