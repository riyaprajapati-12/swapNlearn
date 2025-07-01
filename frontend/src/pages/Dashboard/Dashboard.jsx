import React, { useState, useEffect } from "react";
import DashboardImg from "../../assets/DashboardImg.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import {
  MessageCircle,
  UserCheck,
  Map,
  Star,
  Search,
  LogOut,
} from "lucide-react";
import NewCard from "../../components/NewCard";

const navItems = [
  { label: "Message", icon: <MessageCircle size={20} />, path: "/chatapp" },
  { label: "Request", icon: <UserCheck size={20} />, path: "/requestpage" },
  { label: "Rating", icon: <Star size={20} />, path: "/myratingpage" },
  { label: "Roadmaps", icon: <Map size={20} />, path: "/listroadmap" },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get("/user/getUser");
        setUserData(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.clear();
        navigate("/login");
      }
    };

    const fetchProfiles = async () => {
      try {
        const response = await axiosInstance.get("/profile/allprofiles");
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    const fetchRequestCount = async () => {
      try {
        const res = await axiosInstance.get("/chat-request/getallrequest"); // ✅ Correct backend route
        setRequestCount(res.data.length);
      } catch (error) {
        console.error("Error fetching request count:", error);
      }
    };

    fetchUserData();
    fetchProfiles();
    fetchRequestCount();
  }, [navigate]);

  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredProfiles = profiles.filter((profile) => {
    const skillsOffered = profile.skillsOffered?.map((skill) => skill.toLowerCase()) || [];
    return skillsOffered.some((skill) => skill.includes(searchTerm.toLowerCase()));
  });

  const initials =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName[0]}${userData.lastName[0]}`
      : "";

  const firstName = userData?.firstName || "there";

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${DashboardImg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 w-[88%] h-[85%] max-w-[1663px] rounded-[40px] bg-white/10 backdrop-blur-2xl shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[280px] h-full bg-gradient-to-b from-[#121212] to-[#1c1c1c] text-white rounded-l-[40px] shadow-xl flex flex-col items-center py-8 px-4">
          <h1 className="text-[32px] font-[Itim] text-[#F67F26] mb-6">SwapNLearn</h1>

          <div
            onClick={() => navigate("/profile")}
            className="w-20 h-20 cursor-pointer bg-[#F67F26]/20 border-2 border-[#F67F26] rounded-full mb-4 flex items-center justify-center text-[#F67F26] text-2xl font-bold"
          >
            {initials}
          </div>

          <nav className="mt-4 flex flex-col gap-3 w-full items-center">
            {navItems.map(({ label, icon, path }, index) => (
              <div
                key={index}
                onClick={() => {
                  setActiveTab(label);
                  navigate(path);
                }}
                className={`w-full px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200
                  ${
                    activeTab === label
                      ? "bg-[#F67F26] text-white font-semibold shadow-md"
                      : "hover:bg-[#F67F26]/20 hover:text-[#F67F26] text-gray-300"
                  }`}
              >
                <div className="flex items-center gap-4">
                  {icon}
                  <span className="text-sm">{label}</span>
                </div>

                {/* ✅ Show red badge if there are pending requests */}
                {label === "Request" && requestCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {requestCount}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full rounded-r-[40px] border-l-4 border-[#F67F26] relative px-6 pt-0 overflow-hidden">
          {/* Top Bar */}
          <header className="w-full h-[78px] bg-white/20 backdrop-blur-md border-b border-white/30 flex items-center justify-between px-8 rounded-tr-[40px]">
            <h2 className="text-[22px] font-semibold text-white">
              👋 Hey {firstName}, ready to swap skills?
            </h2>
            <div className="flex items-center gap-4">
              <button
                className="p-2 rounded-full bg-[#F67F26]/20 hover:bg-[#F67F26]/40 transition-colors text-[#F67F26]"
                title="Logout"
                onClick={onLogout}
              >
                <LogOut size={20} />
              </button>
            </div>
          </header>

          {/* Search Bar */}
          <div className="relative mt-6 mb-8 w-full">
            <div className="relative group">
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-[#F67F26]" />
              <input
                id="searchInput"
                type="text"
                placeholder=" "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="peer w-full pl-12 pr-4 pt-4 pb-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#F67F26]/60 focus:border-[#F67F26] transition-all duration-300 shadow-md"
              />
              <label
                htmlFor="searchInput"
                className="absolute left-12 top-2 text-sm text-white/60 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#F67F26]"
              >
                Search for skills...
              </label>
            </div>
          </div>

          {/* User Cards */}
          <div
            className="custom-scroll overflow-y-auto pr-2"
            style={{ maxHeight: "calc(100% - 160px)" }}
          >
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
              {filteredProfiles.map((profile) => (
                <NewCard key={profile._id} profile={profile} />
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
