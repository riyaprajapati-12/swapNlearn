import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";

const RateUserPage = ({ ratedUserId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(null); // null = loading

  // 🔍 Check if the user has already rated
  useEffect(() => {
    const checkIfRated = async () => {
      try {
        const res = await axiosInstance.get(`/profile/has-rated/${ratedUserId}`);
        const alreadyRated = res.data?.hasRated;
        setHasRated(alreadyRated);

        if (alreadyRated) {
          setMessage("⚠️ You've already rated this user.");
        }
      } catch (err) {
        console.error("❌ Error checking rating:", err);
        setHasRated(false); // fallback to allow rating
      }
    };

    checkIfRated();
  }, [ratedUserId]);

  // ⏳ Auto-close modal after 10 seconds if already rated
  useEffect(() => {
    if (hasRated === true) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 1500); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [hasRated, onClose]);

  // ✅ Handle rating submission
  const handleRate = async () => {
    if (hasRated) return; // Prevent re-submission

    if (rating < 1 || rating > 5) {
      setMessage("⚠️ Please select a rating between 1 and 5.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axiosInstance.post("/profile/rate-user", {
        ratedUserId,
        rating,
      });

      const { averageRating, totalRatings } = res.data;

      setMessage(`✅ Thank you! You rated this user ${rating} star${rating > 1 ? "s" : ""}.`);
      setHasRated(true);

      // Auto-close shortly after successful rating
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Something went wrong. Try again.";
      console.error("❌ Rating failed:", errMsg);
      setMessage(`❌ ${errMsg}`);
      setHasRated(true); // Treat as already rated to prevent retry

      // Close after 10s if failed due to duplicate
      setTimeout(() => {
        if (onClose) onClose();
      }, 10000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-zinc-950 text-white p-8 rounded-2xl shadow-2xl border border-zinc-800">
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-400">
          Rate this User
        </h2>

        {/* ⭐ Star Selector */}
        <div className="flex justify-center mb-6 space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => hasRated !== true && setRating(star)}
              className={`text-4xl transition duration-200 ${
                rating >= star ? "text-orange-400" : "text-zinc-600"
              } ${hasRated !== true ? "hover:scale-110" : "opacity-50 cursor-not-allowed"}`}
              disabled={hasRated === true}
            >
              ★
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleRate}
          disabled={submitting || hasRated === true}
          className="w-full py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition duration-200 font-semibold disabled:opacity-50"
        >
          {hasRated ? "Already Rated" : submitting ? "Submitting..." : "Submit Rating"}
        </button>

        {/* Message */}
        {message && (
          <p className="mt-6 text-center text-sm text-orange-300 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RateUserPage;
