const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.getAIChatResponse = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
            reply: "AI Uplink Offline. Please configure GEMINI_API_KEY in the backend environment." 
        });
    }

    try {
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to establish neural handshake with AI." });
    }
};
