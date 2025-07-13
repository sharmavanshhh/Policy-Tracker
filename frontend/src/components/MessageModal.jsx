import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const MessageModal = ({ title = "Alert", message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        onClose();
        // Blur any active input (to hide mobile keyboard)
        if (document.activeElement) {
          document.activeElement.blur();
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="msg-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4"
        >
          <motion.div
            key="msg-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border border-gray-300 w-full max-w-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-crimson-700">{title}</h3>
              <button onClick={handleClose} className="text-gray-500 hover:text-red-600">
                <FaTimes />
              </button>
            </div>

            {/* Message */}
            <p className="text-gray-800 text-sm sm:text-base mb-6 break-words">{message}</p>

            {/* Button */}
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-crimson-700 hover:bg-crimson-800 text-white rounded-full text-sm font-medium shadow"
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageModal;
