import React from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const NewCard = ({ profile }) => {
  const firstName = profile.userId?.firstName;
  const lastName = profile.userId?.lastName;
  const offeredSkills = profile.skillsOffered || [];
  const wantedSkills = profile.skillsWanted || [];
  const avgRating = profile.averageRating?.toFixed(1) || "0.0";
  const totalRatings = profile.totalRatings || "0";

  return (
    <div className="bg-white/90 rounded-[20px] shadow-lg p-6 flex flex-col gap-3 hover:shadow-xl transition w-full max-w-md mx-auto">
      <h3 className="text-[20px] font-semibold text-[#333]">
        {firstName} {lastName}
      </h3>

      <div>
        <p className="text-sm text-[#777] mb-1">Offered Skills:</p>
        <div className="flex flex-wrap gap-2">
          {offeredSkills.map((skill, i) => (
            <span
              key={i}
              className="bg-[#F67F26]/20 text-[#F67F26] px-3 py-1 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-[#777] mb-1">Wanted Skills:</p>
        <div className="flex flex-wrap gap-2">
          {wantedSkills.map((skill, i) => (
            <span
              key={i}
              className="bg-[#333]/10 text-[#333] px-3 py-1 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-[#666] flex items-center gap-1">
          <FaStar className="text-[#F67F26]" />
          {avgRating}/5
          <span className="text-xs text-[#999]">({totalRatings})</span>
        </span>
        <button className="px-3 py-1 bg-[#F67F26] text-white text-sm rounded-md hover:bg-[#e76d1f] transition">
          <Link to="/profilecard" state={{ profile: profile }}>
            View Profile
          </Link>
        </button>
      </div>
    </div>
  );
};

export default NewCard;
