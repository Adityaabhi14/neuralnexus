/**
 * Simulated AI Utility Module
 *
 * These functions simulate AI behavior for the hackathon.
 * Replace the logic inside with real API calls (e.g., OpenAI, Gemini)
 * when you're ready to integrate a real AI provider.
 */

// Simulates improving a fan's question to be clearer and more structured
const improveQuestion = (questionText) => {
  // Capitalize first letter, trim whitespace, add polite framing
  const cleaned = questionText.trim();
  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  // Add a question mark if missing
  const formatted = capitalized.endsWith("?") ? capitalized : `${capitalized}?`;

  return `Could you please share your thoughts on: "${formatted}"`;
};

// Simulates generating a helpful answer suggestion for the creator
const generateAnswerSuggestion = (questionText) => {
  return `Great question! Here's a suggested response for: "${questionText}" — `
    + `You could talk about your personal experience, share a quick story, `
    + `or give a tip that your fans would find valuable.`;
};

module.exports = { improveQuestion, generateAnswerSuggestion };
