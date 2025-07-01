import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const RoadMap = ({ skillName, steps, onBack }) => {
  return (
    <div className="bg-black h-screen w-full relative overflow-hidden">
      {/* Scrollable Content */}
      <div className="custom-scroll overflow-y-auto h-full py-20 px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-orange-400 hover:text-orange-500 transition"
          title="Go back"
        >
          <FaArrowLeft size={24} />
        </button>

        {/* Updated Modern Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-16"
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
            ✨ Let's Master
          </span>
          <span className="text-orange-500 mt-2 block">{skillName}</span>
          <span className="block text-lg sm:text-xl text-orange-300 mt-2 font-medium">
            Your step-by-step roadmap
          </span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto border-l-4 border-orange-500">
          {steps.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-orange-400 font-semibold"
            >
              No steps available for this skill yet. Please check back later!
            </motion.div>
          ) : (
            steps.map((step, index) => (
              <motion.div
                key={index}
                className="mb-12 ml-6 relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
              >
                {/* Dot */}
                <span className="absolute -left-3 top-1 w-6 h-6 bg-orange-500 border-4 border-black rounded-full shadow-lg" />

                {/* Step Card */}
                <div className="bg-black p-6 rounded-xl shadow-md border border-orange-500 hover:shadow-orange-500 transition">
                  <div className="text-sm text-orange-400 font-semibold mb-2">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-orange-100 tracking-wide">
                    {step}
                  </h3>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadMap;
