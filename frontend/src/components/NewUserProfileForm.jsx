import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";

const NewUserProfileForm = () => {
  const [formData, setFormData] = useState({
    about: "",
    location: "",
    skillsOffered: "",
    skillsWanted: "",
    availability: "",
    linkedin: "",
    github: "",
    instagram: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillsOfferedArray = formData.skillsOffered
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    const skillsWantedArray = formData.skillsWanted
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    if (!formData.about || skillsOfferedArray.length === 0 || skillsWantedArray.length === 0) {
      setError("Please fill in all required fields.");
      return;
    }

    const finalData = {
      ...formData,
      skillsOffered: skillsOfferedArray,
      skillsWanted: skillsWantedArray,
    };

    try {
      setLoading(true);
      setError(null);
      await axiosInstance.post("/profile/createprofile", finalData);
      setLoading(false);
      navigate("/profile");
    } catch (error) {
      setLoading(false);
      console.error("Profile Update Error:", error.response?.data || error.message);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl h-[90vh] bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-3xl shadow-lg p-6 flex flex-col justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-center font-[Karantina] text-[#FF8C42] tracking-wide mb-4">
            Complete Your Profile
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="About you..."
              className="col-span-full h-20 bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
            />

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
            />

            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="Availability"
              className="bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
            />

            <input
              type="text"
              name="skillsOffered"
              value={formData.skillsOffered}
              onChange={handleChange}
              placeholder="Skills you can offer (comma-separated)"
              className="col-span-full bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
            />

            <input
              type="text"
              name="skillsWanted"
              value={formData.skillsWanted}
              onChange={handleChange}
              placeholder="Skills you want to learn (comma-separated)"
              className="col-span-full bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
            />

            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              className="bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
            />

            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="GitHub URL"
              className="bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
            />

            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="Instagram URL"
              className="bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
            />
          </div>
        </div>

        <div className="mt-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold text-center mb-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-40 h-12 bg-[#F26B00] hover:bg-orange-500 text-black font-bold rounded-full mx-auto block transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewUserProfileForm;
