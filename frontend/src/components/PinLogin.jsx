import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PinLogin = ({ onSubmit }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [showModal, setShowModal] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every((digit) => digit !== "")) {
      const entered = newPin.join("");
      if (entered === "1234") {
        onSubmit(entered);
      } else {
        setShowModal(true);
        setPin(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && pin[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && pin.every((digit) => digit !== "")) {
      const entered = pin.join("");
      if (entered === "1234") {
        onSubmit(entered);
      } else {
        setShowModal(true);
        setPin(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 z-50 bg-white dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-xl p-8 w-full max-w-sm text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-crimson-800 mb-6"
        >
          Enter PIN
        </motion.h2>

        <div className="flex justify-center gap-3 sm:gap-4 mb-2 sm:mb-4">
          {pin.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit ? "•" : ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="w-12 h-12 sm:w-14 sm:h-14 text-2xl text-center border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-crimson-700 transition"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3 + index * 0.1,
                type: "spring",
                stiffness: 300,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ❌ Incorrect PIN Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-10 sm:bottom-auto sm:top-1/3 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-md shadow-md z-50"
          >
            <p>Incorrect PIN. Please try again.</p>
            <button
              onClick={() => {
                setShowModal(false);
                setPin(["", "", "", ""]);
                inputRefs.current[0]?.focus();
              }}
              className="mt-2 text-sm text-red-600 underline"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PinLogin;
