//swapNlearn123
require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");


// Routes
const userRouter = require("./Routes/userRouter");
const profileRouter = require("./Routes/profileRouter");
const chatRequestRouter = require("./Routes/chatRequestRoutes");
const chatMessageRouter = require("./Routes/chatMessageRoutes");
const roadmapRoutes = require("./Routes/roadmapRouter");

// Models
const ChatRequest = require("./Models/chatRequestSchema");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(cors({ origin: "https://swapnlearn-1.onrender.com", 
  credentials: true }));

// Route handlers
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/chat-request", chatRequestRouter);
app.use("/chat-message", chatMessageRouter);
app.use("/roadmaps", roadmapRoutes);

// In-memory store for online users
let onlineUsers = new Map();

// Emit updated list of online user IDs to all clients
function broadcastOnlineUsers() {
  const userIds = Array.from(onlineUsers.keys());
  io.emit("onlineUsers", userIds);
}

// Socket.IO authentication and event handling
io.on("connection", (socket) => {
  const token = socket.handshake.query.token;

  if (!token) {
    console.log("❌ No token provided");
    socket.disconnect(true);
    return;
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    userId = decoded.id;
  } catch (err) {
    console.log("❌ Invalid token");
    socket.disconnect(true);
    return;
  }

  // Save user's socket
  onlineUsers.set(userId, socket.id);
  console.log(`✅ User ${userId} connected with socket ID ${socket.id}`);
  broadcastOnlineUsers();

  // Handle message sending
  socket.on("sendMessage", async ({ chatId, senderId, receiverId, message }) => {
    try {
      const chatExists = await ChatRequest.findOne({ _id: chatId, status: "accepted" });
      if (!chatExists) {
        return socket.emit("error", { message: "Chat not accepted." });
      }

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          chatId,
          senderId,
          message,
        });
      }

      socket.emit("messageSent", {
        chatId,
        senderId,
        message,
      });
    } catch (error) {
      console.error("❌ Error handling sendMessage:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (onlineUsers.get(userId) === socket.id) {
      onlineUsers.delete(userId);
      console.log(`❌ User ${userId} disconnected`);
      broadcastOnlineUsers();
    }
  });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("🚀 Server is running with Socket.IO on port 8081");
    });
  })
  .catch((err) => {
    console.log("❌ Database connection error:", err);
  });

  const path = require("path");

// Serve Vite build static files
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// Catch-all route: React index.html for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});
