const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String, // Optional — filled when user logs in via Google
  },
  role: {
    type: String,
    enum: ["fan", "creator"],
    default: "fan",
  },
  avatar: {
    type: String, // Profile picture URL
  },
  bio: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
