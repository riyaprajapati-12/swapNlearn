import { FaUserAlt, FaLinkedin, FaGithub, FaInstagram, FaHome } from 'react-icons/fa';
import { useLocation, Link } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import { useState, useEffect } from 'react';
import axiosInstance from "../Utils/axiosInstance";

const ProfileCard = () => {
    const location = useLocation();
    const { profile } = location.state || {};

    const firstName = profile?.userId?.firstName || "Unknown";
    const lastName = profile?.userId?.lastName || "";
    const userTo = profile?.userId?._id;

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const isOwnProfile = loggedInUser?._id === userTo;

    const [requestSent, setRequestSent] = useState(false);
    const [requestAccepted, setRequestAccepted] = useState(false);  // Track request acceptance
    const [showFullAbout, setShowFullAbout] = useState(false);  // Track "Read More" state

    useEffect(() => {
        const checkExistingRequest = async () => {
            try {
                const response = await axiosInstance.get('/chat-request/getallrequest');
                const existing = response.data.find(req =>
                    req.userTo._id === userTo && req.status === "pending"
                );
                if (existing) setRequestSent(true);
                const acceptedRequest = response.data.find(req =>
                    req.userTo._id === userTo && req.status === "accepted"
                );
                if (acceptedRequest) setRequestAccepted(true);  // Set accepted if found
            } catch (error) {
                console.error("Error checking chat request status:", error);
            }
        };

        if (userTo && !isOwnProfile) checkExistingRequest();
    }, [userTo, isOwnProfile]);

    const handleSendRequest = async () => {
        try {
            const response = await axiosInstance.post("/chat-request/send", {
                userTo: userTo,
            });

            if (response.status === 201) {
                setRequestSent(true);
            }
        } catch (error) {
            console.error("Error sending chat request:", error);
            alert(error?.response?.data?.message || "Failed to send request.");
        }
    };

    const toggleAbout = () => setShowFullAbout(prev => !prev);

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col relative ">
            {/* Home Icon */}
            <Link to="/dashboard">
                <div className="absolute top-6 left-6">
                    <FaHome style={{ fontSize: '28px', color: '#FF6F00' }} />
                </div>
            </Link>

            <div className="flex flex-col items-center justify-center mt-20 px-6">
                {/* Profile Card */}
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 bg-[#1c1c1c] shadow-lg rounded-2xl overflow-hidden border border-[#FF6F00]">
                    {/* Left: Avatar & Socials */}
                    <div className="flex flex-col items-center justify-center py-10 px-4 bg-[#2c2c2c]">
                        <div className="h-48 w-48 border-4 border-[#FF6F00] bg-[#FFCC80] flex items-center justify-center rounded-full mb-4">
                            <FaUserAlt style={{ fontSize: '100px', color: '#E65100' }} />
                        </div>

                        <h2 className="text-2xl font-bold text-white">{firstName} {lastName}</h2>

                        <div className="mt-2">
                            <ReactStars count={5} size={24} activeColor="#FF6F00" value={profile?.rating || 4} isHalf={false} edit={false} />
                        </div>

                        <div className="flex gap-4 mt-4">
                            <a
                                href={profile?.linkedin || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={profile?.linkedin ? "hover:text-white transition" : "pointer-events-none opacity-30"}
                            >
                                <FaLinkedin className="text-[#FF6F00] text-xl" />
                            </a>
                            <a
                                href={profile?.github || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={profile?.github ? "hover:text-white transition" : "pointer-events-none opacity-30"}
                            >
                                <FaGithub className="text-[#FF6F00] text-xl" />
                            </a>
                            <a
                                href={profile?.instagram || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={profile?.instagram ? "hover:text-white transition" : "pointer-events-none opacity-30"}
                            >
                                <FaInstagram className="text-[#FF6F00] text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="col-span-2 p-8 bg-[#1c1c1c]">
                        <h3 className="text-2xl font-bold text-[#FF9800] mb-4">Profile Info</h3>

                        <div className="mb-3">
                            <span className="text-[#FF6F00] font-semibold">Location: </span>
                            {profile?.location || "Not provided"}
                        </div>

                        <div className="mb-3">
                            <span className="text-[#FF6F00] font-semibold">About: </span>
                            <p className="text-sm text-gray-300">
                                {showFullAbout
                                    ? (profile?.about || "No details available.")
                                    : (profile?.about?.slice(0, 150) || "No details available.") + (profile?.about?.length > 150 ? "..." : "")}
                            </p>
                            {profile?.about?.length > 150 && (
                                <button
                                    className="mt-1 text-[#FF6F00] hover:underline text-sm"
                                    onClick={toggleAbout}
                                >
                                    {showFullAbout ? "Read Less" : "Read More"}
                                </button>
                            )}
                        </div>

                        <div className="mb-3">
                            <span className="text-[#FF6F00] font-semibold">Skills Wanted:</span>
                            <ul className="list-disc pl-5 text-sm text-gray-300 mt-1">
                                {profile?.skillsWanted?.length ? profile.skillsWanted.map(skill => (
                                    <li key={skill}>{skill}</li>
                                )) : <li>None</li>}
                            </ul>
                        </div>

                        <div className="mb-3">
                            <span className="text-[#FF6F00] font-semibold">Skills Offered:</span>
                            <ul className="list-disc pl-5 text-sm text-gray-300 mt-1">
                                {profile?.skillsOffered?.length ? profile.skillsOffered.map(skill => (
                                    <li key={skill}>{skill}</li>
                                )) : <li>None</li>}
                            </ul>
                        </div>

                        <div className="mb-4">
                            <span className="text-[#FF6F00] font-semibold">Availability: </span>
                            <p className="text-sm text-gray-300">{profile?.availability || "No availability set."}</p>
                        </div>

                        {isOwnProfile ? (
                            <p className="mt-4 px-6 py-2 rounded-lg text-sm font-semibold text-gray-400 bg-gray-800 inline-flex items-center gap-2">
                                <FaUserAlt className="text-[#FF6F00]" />
                                This is your profile
                            </p>
                        ) : (
                            <button
                                className={`mt-4 px-6 py-2 rounded-lg text-sm font-semibold transition duration-300 ${requestSent || requestAccepted ? 'bg-gray-600 text-white cursor-not-allowed' : 'bg-[#FF6F00] text-black hover:bg-[#E65100]'}`}
                                onClick={handleSendRequest}
                                disabled={requestSent || requestAccepted}
                            >
                                {requestAccepted ? "Request Accepted" : (requestSent ? "Request Sent" : "Send Request")}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
