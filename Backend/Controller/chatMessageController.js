const ChatMessage = require("../Models/chatMessageSchema");
const ChatRequest = require("../Models/chatRequestSchema");

// ✅ Send a Message (Protected Route)
const sendMessage = async (req, res) => {
    try {
        const { chatId, receiverId, message } = req.body;

        // Validate fields
        if (!chatId || !receiverId || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the chat request is accepted
        const chatExists = await ChatRequest.findOne({ _id: chatId, status: "accepted" });
        if (!chatExists) {
            return res.status(403).json({ message: "Chat request not accepted." });
        }

        // Save message
        const newMessage = await ChatMessage.create({
            chatId,
            senderId: req.userId,  // Comes from `auth` middleware
            receiverId,
            message,
        });
        


        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error });
    }
};

// ✅ Get all messages of a Chat (Protected Route)
const getChatMessages = async (req, res) => {
    try {
      const { chatId } = req.params;
  
      if (!chatId) {
        return res.status(400).json({ message: "Chat ID is required." });
      }
  
      const messages = await ChatMessage.find({ chatId }).sort({ createdAt: 1 });
  
      // ✅ Return empty array instead of 404
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching messages", error });
    }
  };
  
module.exports = { sendMessage, getChatMessages };
