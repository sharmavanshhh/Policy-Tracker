import React from "react";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaMoneyCheckAlt,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";

const Summary = ({ policies, issuedPolicies, totalFYFRP, totalWFYFRP }) => {
  const total = policies.length;

  const cards = [
    {
      title: "Total Policies",
      value: total,
      icon: <FaFileAlt className="text-crimson-700 text-2xl" />,
    },
    {
      title: "Issued Policies",
      value: issuedPolicies,
      icon: <FaCheckCircle className="text-crimson-700 text-2xl" />,
    },
    {
      title: "Total FYFRP",
      value: `₹${totalFYFRP.toLocaleString()}`,
      icon: <FaMoneyCheckAlt className="text-crimson-700 text-2xl" />,
    },
    {
      title: "Total WFYFRP",
      value: `₹${totalWFYFRP.toLocaleString()}`,
      icon: <FaChartLine className="text-crimson-700 text-2xl" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full mx-auto mt-6 mb-12 px-4 sm:px-6 md:px-0"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-10 px-2 sm:px-4">
        {cards.map(({ title, value, icon }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="bg-white/90 backdrop-blur border border-gray-300 rounded-2xl shadow-md p-6 sm:p-8 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-base sm:text-lg font-semibold text-gray-700">
                {title}
              </p>
              <div>{icon}</div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 break-words">
              {value}
            </h2>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Summary;