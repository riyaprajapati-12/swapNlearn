const express = require("express");
const { sendChatRequest, respondToChatRequest, getUserChatRequests, getAcceptedChats } = require("../Controller/chatRequestController");
const auth = require("../Middleware/auth"); // Protect routes

const router = express.Router();

// ✅ Send a chat request
router.post("/send", auth, sendChatRequest);

// ✅ Accept or Reject a chat request
router.put("/respond", auth, respondToChatRequest);

// ✅ Get chat requests for the logged-in user
router.get("/getallrequest", auth, getUserChatRequests);

router.get("/accepted", auth, getAcceptedChats);



module.exports = router;
