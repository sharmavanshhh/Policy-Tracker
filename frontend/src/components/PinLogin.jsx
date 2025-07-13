import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const PinLogin = ({ onSubmit }) => {
    const [pin, setPin] = useState(["", "", "", ""]);
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

        // Login automatically when all 4 digits are filled
        if (newPin.every((digit) => digit !== "")) {
            onSubmit(newPin.join(""));
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && pin[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "Enter" && pin.every((digit) => digit !== "")) {
            onSubmit(pin.join(""));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 w-full">
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
                            type="password"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            className="w-12 h-12 sm:w-14 sm:h-14 text-2xl text-center border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-crimson-700 transition"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default PinLogin;
