import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({ onClose, onConfirm, message }) => {
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
          key="confirm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4"
        >
          <motion.div
            key="confirm-modal"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-300 w-full max-w-[90vw] sm:max-w-sm md:max-w-md"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-bold text-crimson-700">
                Confirm Delete
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-600"
              >
                <FaTimes className="text-base" />
              </button>
            </div>

            {/* Message */}
            <p className="text-sm sm:text-base text-gray-800 mb-6 break-words">
              {message}
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
                className="px-4 sm:px-5 py-2 bg-crimson-700 hover:bg-crimson-800 text-white rounded-full text-sm font-medium shadow"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
