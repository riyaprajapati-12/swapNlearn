import { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const RequestPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axiosInstance.get("/chat-request/getallrequest");
                const pendingToMe = response.data.filter(
                    req => req.status === "pending" && req.userTo?._id !== req.userFrom?._id
                );
                setRequests(pendingToMe);
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleRequestAction = async (requestId, status) => {
        try {
            await axiosInstance.put("/chat-request/respond", {
                requestId,
                status,
            });

            console.log(`✅ ${status.toUpperCase()} request with ID: ${requestId}`);
            setRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (error) {
            console.error(`❌ Failed to ${status} request:`, error);
            alert(error?.response?.data?.message || "Something went wrong.");
        }
    };

    const getInitials = (firstName = "", lastName = "") =>
        `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <Link to="/dashboard">
                    <Home className="w-7 h-7 text-orange-400  mr-3 cursor-pointer hover:text-orange-300" />
                </Link>
                
            </div>
            <h2 className="text-3xl font-bold mt-5 mb-6 text-orange-400">Requests</h2>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : requests.length === 0 ? (
                <div className="text-center mt-20 text-gray-500">
                    <img
                        src="https://illustrations.popsy.co/gray/communication.svg"
                        alt="No requests"
                        className="mx-auto mb-4 w-48"
                    />
                    <p>No chat requests right now. Check back later!</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    <AnimatePresence>
                        {requests.map((req) => (
                            <motion.li
                                key={req._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="border border-orange-400 rounded-lg p-4 bg-gray-900 flex justify-between items-center shadow-md hover:shadow-orange-500/40 transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    {/* Avatar with initials */}
                                    <div className="w-10 h-10 flex items-center justify-center bg-orange-600 text-white font-bold rounded-full">
                                        {getInitials(req.userFrom?.firstName, req.userFrom?.lastName)}
                                    </div>
                                    <div>
                                        <p>
                                            <span className="text-orange-300 font-semibold">
                                                {req.userFrom?.firstName} {req.userFrom?.lastName}
                                            </span>{" "}
                                            sent you a request!
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {formatDistanceToNow(new Date(req.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg transition-colors"
                                        onClick={() => handleRequestAction(req._id, "accepted")}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition-colors"
                                        onClick={() => handleRequestAction(req._id, "rejected")}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
        </div>
    );
};

export default RequestPage;
