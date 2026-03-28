const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Expose static local files natively mapping clean binary downloads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend spinning up on http://localhost:${PORT}`));
