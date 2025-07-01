import React, { useState } from "react";
import axiosInstance from "../Utils/axiosInstance";

const EditUserProfileForm = ({ profileData, setIsEditing, refreshProfile }) => {
  const [formData, setFormData] = useState({
    about: profileData?.about || "",
    location: profileData?.location || "",
    skillsOffered: (profileData?.skillsOffered || []).join(", "),
    skillsWanted: (profileData?.skillsWanted || []).join(", "),
    availability: profileData?.availability || "",
    linkedin: profileData?.linkedin || "",
    github: profileData?.github || "",
    instagram: profileData?.instagram || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    if (
      !formData.about ||
      !formData.location ||
      !formData.availability ||
      skillsOfferedArray.length === 0 ||
      skillsWantedArray.length === 0
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const updatedProfile = {
      ...formData,
      skillsOffered: skillsOfferedArray,
      skillsWanted: skillsWantedArray,
    };

    try {
      setLoading(true);
      setError(null);
      await axiosInstance.put("/profile/updateprofile", updatedProfile);
      await refreshProfile(); // Refresh UI data
      setIsEditing(false);    // Close modal
      setLoading(false);
    } catch (error) {
      console.error("Profile Update Error:", error.response?.data || error.message);
      setError("Failed to update profile. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-3xl shadow-lg p-8 relative overflow-y-auto max-h-[90vh]">
      <h1 className="text-4xl font-bold text-center font-[Karantina] text-[#FF8C42] tracking-wide mb-6">
        Edit Your Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="about"
          value={formData.about}
          onChange={handleChange}
          placeholder="About you..."
          className="w-full h-24 bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
        />

        <input
          type="text"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          placeholder="Availability"
          className="w-full bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
        />

        <input
          type="text"
          name="skillsOffered"
          value={formData.skillsOffered}
          onChange={handleChange}
          placeholder="Skills you can offer (comma-separated)"
          className="w-full bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
        />

        <input
          type="text"
          name="skillsWanted"
          value={formData.skillsWanted}
          onChange={handleChange}
          placeholder="Skills you want to learn (comma-separated)"
          className="w-full bg-transparent border border-[#333] rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F26B00] transition-all"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="w-40 h-12 border border-gray-600 text-gray-300 hover:text-white rounded-full transition-all duration-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-40 h-12 bg-[#F26B00] hover:bg-orange-500 text-black font-bold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserProfileForm;
