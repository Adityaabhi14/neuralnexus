const { readData } = require("../utils/fileHandler");
require("dotenv").config();

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Subscription gating
    const users = await readData("users.json");
    const user = users.find((u) => u.id === userId);

    if (!user || user.subscription === "Free") {
      return res.status(403).json({
        error: "Access Denied. Upgrade to Pro or Creator Premium to use AI features.",
      });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({
        reply: "AI is currently unavailable. Please configure the GEMINI_API_KEY.",
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    });

    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Gemini API unexpected response:", JSON.stringify(data));
      return res.status(500).json({ reply: "AI is currently unavailable. Please try again later." });
    }

    res.json({ reply: text });

  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({
      reply: "AI is currently unavailable. Please try again later.",
    });
  }
};
