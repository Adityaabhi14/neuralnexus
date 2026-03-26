const express = require("express");
const router = express.Router();
const { createAnswer } = require("../controllers/answerController");
const upload = require("../middleware/upload");

// POST /api/answers — Submit an answer (with optional video upload)
// upload.single("video") handles a single file field named "video"
router.post("/", upload.single("video"), createAnswer);

module.exports = router;
