const ChatRequest = require("../Models/chatRequestSchema");

/**
 * 📌 Send a chat request
 */
exports.sendChatRequest = async (req, res) => {
  try {
    const { userTo } = req.body;
    const userFrom = req.userId; // Authenticated user's ID

    // ❌ Prevent sending request to self
    if (userTo === userFrom) {
      return res.status(400).json({ message: "You cannot send a request to yourself." });
    }

    // ✅ Check if a request already exists in either direction and is not rejected
    const existingRequest = await ChatRequest.findOne({
      $or: [
        { userFrom, userTo },
        { userFrom: userTo, userTo: userFrom }
      ],
      status: { $in: ["pending", "accepted"] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: "A chat request already exists between these users." });
    }

    // ✅ Create a new chat request
    const newRequest = new ChatRequest({ userFrom, userTo });
    await newRequest.save();

    res.status(201).json({ message: "Chat request sent", request: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * 📌 Accept or Reject Chat Request
 */
exports.respondToChatRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    // ✅ Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const chatRequest = await ChatRequest.findById(requestId);
    if (!chatRequest) {
      return res.status(404).json({ message: "Chat request not found" });
    }

    // ✅ Update the request status
    chatRequest.status = status;
    await chatRequest.save();

    res.status(200).json({ message: `Chat request ${status}`, chatRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * 📌 Get all incoming pending chat requests for the logged-in user
 */
exports.getUserChatRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const chatRequests = await ChatRequest.find({
      status: "pending",
      userTo: userId, // ✅ Only requests sent TO the current user
    }).populate("userFrom", "firstName lastName email");

    res.status(200).json(chatRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * 📌 Get all accepted chat connections for the logged-in user
 */
exports.getAcceptedChats = async (req, res) => {
  try {
    const userId = req.userId;

    const acceptedChats = await ChatRequest.find({
      status: "accepted",
      $or: [{ userFrom: userId }, { userTo: userId }],
    }).populate("userFrom userTo", "firstName lastName email");

    res.status(200).json(acceptedChats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
