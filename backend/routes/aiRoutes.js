const express = require("express");
const { getAIChatResponse } = require("../controllers/aiController");
const router = express.Router();

router.post("/chat", getAIChatResponse);

module.exports = router;
