import React from "react";
import { FaUserCircle, FaUserPlus } from "react-icons/fa";
import Intro from "../assets/Intro.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden font-[Inter] bg-[#0f0f0f] text-white">
      
      {/* Left Image Section */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 3 }}
        className="md:w-1/2 w-full h-[40vh] md:h-full"
      >
        <img
          src={Intro}
          alt="Learning with SwapNLearn"
          className="w-full h-full object-cover object-center brightness-90"
        />
      </motion.div>

      {/* Right Content Section */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="md:w-1/2 w-full min-h-[60vh] flex flex-col items-center px-4 md:px-16 py-10 justify-center text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-white leading-tight"
        >
          Welcome to <span className="text-[#FF8C42]">SwapNLearn</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 text-base md:text-lg text-gray-300 max-w-xl"
        >
          Share your skills. Learn from others. Grow together.
          <br />
          Start your journey today with a passionate learning community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10 flex flex-col gap-6 w-full max-w-[320px]"
        >
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF8C42] to-[#ff6a00] text-black font-bold text-xl rounded-full py-4 shadow-xl hover:scale-105 transition duration-300"
          >
            <FaUserCircle size={26} />
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="flex items-center justify-center gap-3 bg-white text-[#FF8C42] font-bold text-xl rounded-full py-4 shadow-lg hover:scale-105 transition duration-300"
          >
            <FaUserPlus size={24} />
            Signup
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IntroPage;
