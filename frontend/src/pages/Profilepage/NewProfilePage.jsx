import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaUser,
  FaEdit,
} from "react-icons/fa";
import axiosInstance from "../../Utils/axiosInstance";
import EditUserProfileForm from "../../components/EditUserProfileForm";
import { Link } from 'react-router-dom';

const NewProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/profile/getprofile");
      setProfileData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden relative">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gradient-to-b from-orange-600 to-orange-400 shadow-2xl flex flex-col justify-between p-6">
        <div>
         <Link
  to="/dashboard"
  className="flex items-center gap-3 text-white hover:text-black transition-colors mb-8"
>
  <FaHome className="text-xl" />
  <span className="text-md font-semibold">Dashboard</span>
</Link>

          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-white shadow-md flex items-center justify-center mb-4">
              <FaUser className="text-5xl text-white" />
            </div>
            <h2 className="text-lg font-bold">
              {profileData?.userId?.firstName} {profileData?.userId?.lastName}
            </h2>
            <p className="text-sm italic text-white/90 mt-1">Skill Swapper</p>
            <p className="text-xs mt-1 text-white/80">
              {profileData?.userId?.email}
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4 text-2xl mt-6">
          {profileData?.instagram && (
            <a
              href={profileData.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              style={{ color: "#E1306C" }}
            >
              <FaInstagram />
            </a>
          )}
          {profileData?.github && (
            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              style={{ color: "#f5f5f5" }}
            >
              <FaGithub />
            </a>
          )}
          {profileData?.linkedin && (
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              style={{ color: "#0A66C2" }}
            >
              <FaLinkedin />
            </a>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="w-3/4 p-10 bg-zinc-900 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-orange-500">
                {profileData?.userId?.firstName} {profileData?.userId?.lastName}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {profileData?.location}
              </p>
            </div>
            <FaEdit
              className="text-orange-400 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setIsEditing(true)}
            />
          </div>

          {!isEditing && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-orange-400">
                  About Me
                </h2>
                <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap break-words leading-6">
                  {showFullAbout
                    ? profileData?.about
                    : profileData?.about?.slice(0, 200) +
                      (profileData?.about?.length > 200 ? "..." : "")}
                </p>
                {profileData?.about?.length > 200 && (
                  <button
                    onClick={() => setShowFullAbout(!showFullAbout)}
                    className="mt-2 text-orange-400 text-sm hover:underline focus:outline-none"
                  >
                    {showFullAbout ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-orange-400">
                  Skills Offered
                </h2>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-2 space-y-1">
                  {profileData?.skillsOffered?.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-orange-400">
                  Skills Wanted
                </h2>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-2 space-y-1">
                  {profileData?.skillsWanted?.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-orange-400">
                  Availability
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                  {profileData?.availability}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4">
          <EditUserProfileForm
            profileData={profileData}
            setIsEditing={setIsEditing}
            refreshProfile={fetchProfile}
          />
        </div>
      )}
    </div>
  );
};

export default NewProfilePage;
