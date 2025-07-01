import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoadMap from "../components/RoadMap";
import axiosInstance from "../Utils/axiosInstance";
import {
  FaLaptopCode, FaPython, FaDatabase, FaMobileAlt, FaChartLine,
  FaDev, FaReact, FaBrain, FaPaintBrush, FaBitcoin, FaShieldAlt,
  FaJava, FaRocket, FaHome,FaAws
} from "react-icons/fa";
import { SiC, SiCplusplus, SiNextdotjs } from "react-icons/si";
import { ClipLoader } from "react-spinners";

const ListRoadMap = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const skillIcons = {
    "web development": <FaLaptopCode size={40} />,
    java: <FaJava size={40} />,
    c: <SiC size={40} />,
    cpp: <SiCplusplus size={40} />,
    python: <FaPython size={40} />,
    "data structures and algorithms": <FaChartLine size={40} />,
    "machine learning": <FaBrain size={40} />,
    react: <FaReact size={40} />,
    "node.js": <FaLaptopCode size={40} />,
    "next.js": <SiNextdotjs size={40} />,
    cybersecurity: <FaShieldAlt size={40} />,
    "ui/ux design": <FaPaintBrush size={40} />,
    devops: <FaDev size={40} />,
    "android development": <FaMobileAlt size={40} />,
    sql: <FaDatabase size={40} />,
    "data analysis": <FaChartLine size={40} />,
    "blockchain basics": <FaBitcoin size={40} />,
    "aws cloud":<FaAws size={40} />
  };

  const fetchRoadmaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const userProfileResponse = await axiosInstance.get("/profile/getprofile");
      const skillsWanted = userProfileResponse.data.skillsWanted.join(",");
      const roadmapResponse = await axiosInstance.get(`/roadmaps/seedroadmap?skillsWanted=${skillsWanted}`);
      setRoadmaps(roadmapResponse.data);
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
      setError("Oops! We couldn’t load the roadmaps. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleBack = () => {
    setSelectedSkill(null);
  };

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="bg-black min-h-screen text-orange-400 px-6 py-12 font-sans relative transition-all">
      {/* Home icon */}
      {!selectedSkill && (
        <button
          onClick={handleHomeClick}
          className="absolute top-6 left-6 text-orange-400 hover:text-orange-500 transition duration-300 ease-in-out"
          title="Go to Dashboard"
        >
          <FaHome size={28} />
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <ClipLoader color="#f97316" loading={loading} size={60} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchRoadmaps}
            className="mt-4 bg-orange-500 text-black px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main UI */}
      {!selectedSkill ? (
        <div>
          {/* Modern Heading */}
          <div className="relative mb-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-300/5 rounded-xl blur-lg"></div>
            <div className="relative z-10 px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
                Your Journey Starts <span className="text-orange-500">Here</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-orange-300 font-medium max-w-3xl mx-auto">
                Dive into curated roadmaps and build skills in tech, design, data, and more — tailored just for you.
              </p>
            </div>
            
          </div>

          {/* Roadmap Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {roadmaps.map((roadmap, index) => {
              const skillIcon = skillIcons[roadmap.skillName.toLowerCase()] || (
                <div className="text-3xl font-bold text-orange-400">📘</div>
              );

              return (
                <div
                  key={index}
                  className="bg-black border-2 border-orange-500 rounded-xl p-6 cursor-pointer hover:shadow-[0_0_20px_#f97316] transform hover:scale-105 transition duration-300 ease-in-out"
                  onClick={() => setSelectedSkill(roadmap)}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-500 rounded-full w-20 h-20 flex items-center justify-center text-black shadow-lg">
                      {skillIcon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center capitalize mb-2 text-orange-400">
                    {roadmap.skillName}
                  </h3>
                  <p className="text-center text-sm text-orange-300 font-medium">
                    Click to view roadmap
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        

        <RoadMap
          skillName={selectedSkill.skillName}
          steps={selectedSkill.steps}
          onBack={handleBack}
        />
        
      )}
    </div>
  );
};

export default ListRoadMap;
