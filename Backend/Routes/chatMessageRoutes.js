const express = require("express");
const { sendMessage, getChatMessages } = require("../Controller/chatMessageController");
const auth = require("../Middleware/auth");

const router = express.Router();

// ✅ Send Message (Authenticated)
router.post("/send", auth, sendMessage);

// ✅ Get Chat Messages (Authenticated)
router.get("/:chatId", auth, getChatMessages);

module.exports = router;
