import React, { useEffect, useState } from 'react';
import axiosInstance from '../Utils/axiosInstance'; 
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; 

const MyRatingPage = () => {
  const [ratingData, setRatingData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axiosInstance.get(`/profile/user/${userId}/ratings`);
        setRatingData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch rating data');
      }
    };

    fetchRating();
  }, []);

  const renderStars = (avg) => {
    const stars = [];
    const fullStars = Math.floor(avg);
    const hasHalfStar = avg - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-orange-400 text-3xl drop-shadow-glow">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-orange-300 text-3xl drop-shadow-glow">★</span>);
    }

    while (stars.length < 5) {
      stars.push(<span key={`empty-${stars.length}`} className="text-gray-600 text-3xl">☆</span>);
    }

    return stars;
  };

  const renderBreakdown = () => {
    const { ratingBreakdown, totalRatings } = ratingData;

    return [5, 4, 3, 2, 1].map((star) => {
      const count = ratingBreakdown?.[star] || 0;
      const percentage = totalRatings ? (count / totalRatings) * 100 : 0;

      return (
        <div key={star} className="flex items-center space-x-3 mb-2">
          <div className="w-12 text-sm text-gray-300">{star} star</div>
          <div className="flex-1 bg-gray-800 rounded-full h-3">
            <div
              className="bg-orange-400 h-3 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="w-8 text-sm text-gray-400 text-right">{count}</div>
        </div>
      );
    });
  };

  const handleHomeClick = () => {
    navigate('/dashboard'); // Navigate to dashboard page
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-10 font-semibold text-lg">
        {error}
      </div>
    );
  }

  if (!ratingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-orange-300 text-lg animate-pulse">Loading your rating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-950 border border-orange-500 shadow-lg shadow-orange-500/20 rounded-3xl p-8 text-white">
        {/* Home Icon */}
        <div
          onClick={handleHomeClick}
          className="absolute top-4 left-4 p-2 cursor-pointer text-orange-500 hover:text-orange-400 transition-colors"
        >
          <FaHome size={24} /> {/* Home icon with size */}
        </div>

        <h2 className="text-4xl font-extrabold text-center text-orange-400 mb-6 tracking-wide">
          Your Rating
        </h2>

        <div className="flex justify-center mb-4 space-x-1">
          {renderStars(ratingData.averageRating)}
        </div>

        <p className="text-center text-sm text-gray-400 mb-6">
          Based on {ratingData.totalRatings} rating{ratingData.totalRatings !== 1 && 's'}
        </p>

        <div className="mt-2">
          <h3 className="text-md font-semibold text-orange-300 mb-3">How people rated you:</h3>
          {renderBreakdown()}
        </div>

        <div className="mt-6 border-t border-gray-700 pt-4 text-center">
          <p className="text-md text-gray-300">
            Keep growing your reputation and keep swapping!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyRatingPage;
