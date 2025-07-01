import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Home, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../Utils/axiosInstance";
import RateUserPage from "../pages/RateUserPage"; 

const ChatApp = () => {
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [socketInstance, setSocketInstance] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [userToRate, setUserToRate] = useState(null);

  const userId = useRef(null);
  const chatIdRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    userId.current = decoded.id;

    const socket = io("http://localhost:8081", {
      query: { token },
    });

    setSocketInstance(socket);

    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection failed:", err);
    });

    socket.on("onlineUsers", (userIds) => {
      setOnlineUserIds(userIds);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchAcceptedUsers = async () => {
      try {
        const res = await axiosInstance.get("/chat-request/accepted");
        setAcceptedUsers(
          res.data.map((req) => {
            const otherUser =
              req.userFrom._id === userId.current ? req.userTo : req.userFrom;
            return {
              ...otherUser,
              chatId: req._id,
            };
          })
        );
      } catch (err) {
        console.error("Failed to fetch accepted users", err);
      }
    };

    fetchAcceptedUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        setMessages([]);
        const res = await axiosInstance.get(`/chat-message/${selectedUser.chatId}`);
        setMessages(res.data);
        setChatId(selectedUser.chatId);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  useEffect(() => {
    if (!socketInstance) return;

    const handleReceiveMessage = (data) => {
      if (data.chatId === chatIdRef.current) {
        setMessages((prev) => [
          ...prev,
          {
            senderId: data.senderId,
            message: data.message,
            timestamp: new Date(),
          },
        ]);
      }
    };

    socketInstance.on("receiveMessage", handleReceiveMessage);

    return () => {
      socketInstance.off("receiveMessage", handleReceiveMessage);
    };
  }, [socketInstance]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !socketInstance) return;

    try {
      const msgPayload = {
        chatId,
        receiverId: selectedUser._id,
        message: newMessage,
      };

      await axiosInstance.post("/chat-message/send", msgPayload);

      socketInstance.emit("sendMessage", {
        ...msgPayload,
        senderId: userId.current,      //msg send kr raahe h yaha se server ko 
      });

      setMessages((prev) => [
        ...prev,
        {
          senderId: userId.current,
          message: newMessage,
          timestamp: new Date(),
        },
      ]);
      setNewMessage("");
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white font-sans">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-80 bg-zinc-950 p-6 border-r border-zinc-800 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard">
            <Home className="text-orange-400 hover:text-orange-500 w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-extrabold tracking-wide">swapNlearn</h2>
        </div>
        <div className="space-y-3 overflow-y-auto">
          {acceptedUsers.map((user) => {
            const isOnline = onlineUserIds.includes(user._id);
            const isSelected = selectedUser?._id === user._id;
            return (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all backdrop-blur-md ${
                  isSelected ? "bg-orange-600/80" : "hover:bg-zinc-800/70"
                }`}
              >
                <div className="w-10 h-10 bg-orange-500 text-black font-bold flex items-center justify-center rounded-full shadow-md">
                  {getInitials(`${user.firstName} ${user.lastName}`)}
                </div>
                <div className="flex-1">
                  <div className="truncate font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
                {isOnline && (
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-md" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col bg-zinc-900 backdrop-blur-xl">
        {selectedUser ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedUser._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              <div className="p-5 bg-zinc-950 border-b border-zinc-800 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-600 text-black font-bold flex items-center justify-center rounded-full shadow-md">
                  {getInitials(`${selectedUser.firstName} ${selectedUser.lastName}`)}
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {onlineUserIds.includes(selectedUser._id) ? "Online" : "Offline"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUserToRate(selectedUser._id);
                    setShowRating(true);
                    setSelectedUser(null);
                  }}
                  className="ml-auto text-sm text-red-400 hover:text-red-500"
                >
                  End Chat
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-sm px-5 py-3 rounded-2xl shadow-md backdrop-blur-md text-sm ${
                      msg.senderId === userId.current
                        ? "bg-orange-500/90 text-white self-end ml-auto"
                        : "bg-zinc-800/80 text-white self-start mr-auto"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <div className="text-[10px] text-right text-zinc-300 mt-1">
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex gap-3 items-center">
                <input
                  type="text"
                  className="flex-1 bg-zinc-800 text-white border border-zinc-700 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition"
                  onClick={sendMessage}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>

      {showRating && (
        <RateUserPage
          ratedUserId={userToRate}
          onClose={() => setShowRating(false)}
        />
      )}
    </div>
  );
};

export default ChatApp;
