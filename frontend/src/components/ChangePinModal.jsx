import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ChangePinModal = ({ onClose, onSubmit, currentPin }) => {
  const [oldPin, setOldPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1); // 1: old pin, 2: new pin, 3: confirm pin
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const oldPinRefs = useRef([]);
  const newPinRefs = useRef([]);
  const confirmPinRefs = useRef([]);

  useEffect(() => {
    if (step === 1) oldPinRefs.current[0]?.focus();
    else if (step === 2) newPinRefs.current[0]?.focus();
    else if (step === 3) confirmPinRefs.current[0]?.focus();
  }, [step]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handlePinChange = (index, value, pinArray, setPinArray, refs) => {
    if (!/^\d?$/.test(value)) return;

    const newPinArray = [...pinArray];
    newPinArray[index] = value;
    setPinArray(newPinArray);

    if (value && index < 3) {
      refs.current[index + 1]?.focus();
    }

    if (newPinArray.every((digit) => digit !== "")) {
      handleStepComplete(newPinArray);
    }
  };

  const handleKeyDown = (e, index, pinArray, refs) => {
    if (e.key === "Backspace" && pinArray[index] === "" && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleStepComplete = (pinArray) => {
    const pin = pinArray.join("");

    if (step === 1) {
      // Verify old PIN
      if (pin === currentPin) {
        setError("");
        setStep(2);
      } else {
        setError("Incorrect current PIN");
        setOldPin(["", "", "", ""]);
        setTimeout(() => oldPinRefs.current[0]?.focus(), 100);
      }
    } else if (step === 2) {
      // Move to confirm new PIN
      setError("");
      setStep(3);
    } else if (step === 3) {
      // Verify new PIN matches
      const newPinStr = newPin.join("");
      if (pin === newPinStr) {
        onSubmit(newPinStr);
        handleClose();
      } else {
        setError("PINs do not match");
        setConfirmPin(["", "", "", ""]);
        setTimeout(() => confirmPinRefs.current[0]?.focus(), 100);
      }
    }
  };

  const renderPinInputs = (pinArray, setPinArray, refs, label) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
        {label}
      </label>
      <div className="flex justify-center gap-3 sm:gap-4 mb-4">
        {pinArray.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (refs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit ? "•" : ""}
            onChange={(e) => handlePinChange(index, e.target.value, pinArray, setPinArray, refs)}
            onKeyDown={(e) => handleKeyDown(e, index, pinArray, refs)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className="w-12 h-12 sm:w-14 sm:h-14 text-2xl text-center border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-crimson-700 transition"
          />
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border border-gray-300 w-full max-w-sm">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-crimson-700">Change PIN</h3>
                <button onClick={handleClose} className="text-gray-500 hover:text-red-600">
                  <FaTimes />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-12 rounded-full transition-colors ${
                      s === step
                        ? "bg-crimson-700"
                        : s < step
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                  {error}
                </div>
              )}

              {/* PIN Input Based on Step */}
              {step === 1 &&
                renderPinInputs(oldPin, setOldPin, oldPinRefs, "Enter Current PIN")}
              {step === 2 &&
                renderPinInputs(newPin, setNewPin, newPinRefs, "Enter New PIN")}
              {step === 3 &&
                renderPinInputs(
                  confirmPin,
                  setConfirmPin,
                  confirmPinRefs,
                  "Confirm New PIN"
                )}

              {/* Cancel Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleClose}
                  className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full text-sm font-medium shadow"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChangePinModal;