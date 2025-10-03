import React, { useEffect, useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const DeleteAllModal = ({ onClose, onConfirm, policyCount }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(onClose, 300);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="delete-all-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4"
        >
          <motion.div
            key="delete-all-modal"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-300 w-full max-w-[90vw] sm:max-w-md"
          >
            {/* Header with Warning Icon */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
                <h3 className="text-base sm:text-lg font-bold text-crimson-700">
                  Delete All Policies
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-600"
              >
                <FaTimes className="text-base" />
              </button>
            </div>

            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm sm:text-base text-red-800 font-semibold mb-2">
                ⚠️ Warning: This action cannot be undone!
              </p>
              <p className="text-sm text-gray-700">
                You are about to permanently delete <span className="font-bold text-red-600">{policyCount}</span> {policyCount === 1 ? 'policy' : 'policies'} from the database.
              </p>
            </div>

            {/* Confirmation Message */}
            <p className="text-sm sm:text-base text-gray-800 mb-6">
              Are you sure you want to delete all policies? This will remove all data including customer information, premiums, and dates.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 sm:px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full text-sm font-medium shadow"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 sm:px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium shadow"
              >
                Delete All
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAllModal;