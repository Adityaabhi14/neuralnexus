const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// --- Routes ---
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/answers", require("./routes/answerRoutes"));

// --- Health check route ---
app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend is running!" });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking — server starts regardless)
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
