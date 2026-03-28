const express = require("express");
const { getConversation, sendMessage } = require("../controllers/messageController");

const router = express.Router();

router.route("/").post(sendMessage);
router.route("/:userA/:userB").get(getConversation);

module.exports = router;
