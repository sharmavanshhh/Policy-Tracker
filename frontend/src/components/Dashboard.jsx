import React from "react";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaMoneyCheckAlt,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

const Dashboard = ({ totalPolicies, totalFYFRP, totalWFYFRP, onViewDetails }) => {
  return (
    <div className="text-gray-900 font-sans flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-7xl text-center py-12 sm:py-16 px-4 sm:px-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-crimson-800 mb-4"
        >
          Welcome, <span className="block sm:inline">Avaneet Kumar</span>
        </motion.h1>

        <p className="text-gray-600 text-sm sm:text-base mb-12 sm:mb-16">
          {/* Here’s a quick overview of your policy data */}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 px-2 sm:px-4">
          {[
            {
              title: "Total Policies",
              value: totalPolicies,
              icon: <FaFileAlt />,
            },
            {
              title: "Total FYFRP",
              value: `₹${totalFYFRP.toLocaleString()}`,
              icon: <FaMoneyCheckAlt />,
            },
            {
              title: "Total WFYFRP",
              value: `₹${totalWFYFRP.toLocaleString()}`,
              icon: <FaChartLine />,
            },
          ].map(({ title, value, icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white/90 backdrop-blur border border-gray-300 rounded-2xl shadow-md p-6 sm:p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm sm:text-base font-semibold text-gray-700">
                  {title}
                </p>
                <div className="text-crimson-700 text-lg sm:text-xl">
                  {icon}
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 break-words">
                {value}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-12 sm:mt-16">
          <motion.button
            onClick={onViewDetails}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-crimson-700 to-gray-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-md font-medium shadow-md transition hover:scale-105"
          >
            View Detailed Data <FaArrowRight className="text-sm sm:text-base" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
