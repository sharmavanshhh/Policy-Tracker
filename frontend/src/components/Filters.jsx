import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaTimesCircle,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";

const Filters = ({ policies, onFilterChange, showModal, setShowModal }) => {
  const [filters, setFilters] = useState({
    mode: "",
    advisor: "",
    month: "",
    search: "",
  });

  const [tempFilters, setTempFilters] = useState({ ...filters });
  const [searchInput, setSearchInput] = useState("");

  const advisors = [...new Set(policies.map((p) => p.advisorName))].filter(Boolean);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleTempChange = (key, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    const cleared = { mode: "", advisor: "", month: "", search: "" };
    setFilters(cleared);
    setTempFilters(cleared);
    setSearchInput("");
    setShowModal(false);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowModal(false);
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput }));
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#d1d5db",
      borderRadius: "0.375rem",
      borderColor: "#d1d5db",
      boxShadow: "none",
      minHeight: "2.5rem",
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#1f2937",
      padding: "0 6px",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    menu: (base) => ({ ...base, zIndex: 9999, color: "#111827" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#e5e7eb" : "#fff",
      color: "#111827",
      fontSize: "0.875rem",
    }),
    singleValue: (base) => ({ ...base, color: "#1f2937" }),
    placeholder: (base) => ({ ...base, color: "#1f2937" }),
  };

  return (
    <div className="relative w-[90%] max-w-lg mx-auto mb-6">
      {/* Search Bar */}
      <div className="relative w-full">
        {searchInput === "" && (
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-opacity" />
        )}

        {searchInput !== "" && filters.search === "" ? (
          // Show arrow if typing but not yet submitted
          <button
            onClick={() => {
              handleSearch();
              document.activeElement?.blur();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crimson-800 hover:text-crimson-800 transition"
          >
            <FaArrowRight className="text-lg" />
          </button>
        ) : null}

        {filters.search !== "" && (
          // Show clear (X) button after search is applied
          <button
            onClick={() => {
              setSearchInput("");
              setFilters((prev) => ({ ...prev, search: "" }));
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crimson-800 hover:text-crimson-800 transition"
          >
            <FaTimesCircle className="text-lg" />
          </button>
        )}

        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
              e.target.blur();
            }
          }}
          placeholder="Search Customers"
          className={`w-full ${searchInput === "" ? "pl-10" : "pl-4"} pr-10 py-2 bg-neutral-100 text-gray-800 rounded-3xl focus:outline-none transition`}
        />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 bg-white/90 backdrop-blur border-t border-gray-300 rounded-t-2xl shadow-xl p-6 mx-auto w-full max-w-4xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Filter Policies</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-crimson-800 hover:text-crimson-800"
                >
                  <FaTimesCircle size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Mode */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <Select
                    value={
                      tempFilters.mode
                        ? { label: tempFilters.mode, value: tempFilters.mode }
                        : null
                    }
                    onChange={(option) =>
                      handleTempChange("mode", option?.value || "")
                    }
                    options={["Yearly", "Half-Yearly", "Quarterly", "Monthly"].map((m) => ({
                      value: m,
                      label: m,
                    }))}
                    styles={customSelectStyles}
                    placeholder="Select Mode"
                  />
                </div>

                {/* Advisor */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-medium text-gray-700 mb-1">Advisor</label>
                  <Select
                    value={
                      tempFilters.advisor
                        ? { label: tempFilters.advisor, value: tempFilters.advisor }
                        : null
                    }
                    onChange={(option) =>
                      handleTempChange("advisor", option?.value || "")
                    }
                    options={advisors.map((name) => ({ value: name, label: name }))}
                    styles={customSelectStyles}
                    placeholder="Select Advisor"
                  />
                </div>

                {/* Month */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-medium text-gray-700 mb-1">Issued Month</label>
                  <Select
                    value={
                      tempFilters.month
                        ? {
                          label: new Date(0, parseInt(tempFilters.month) - 1).toLocaleString("en-IN", {
                            month: "short",
                          }),
                          value: tempFilters.month,
                        }
                        : null
                    }
                    onChange={(option) =>
                      handleTempChange("month", option?.value || "")
                    }
                    options={Array.from({ length: 12 }, (_, i) => ({
                      value: String(i + 1).padStart(2, "0"),
                      label: new Date(0, i).toLocaleString("en-IN", { month: "short" }),
                    }))}
                    styles={customSelectStyles}
                    placeholder="Select Month"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3">
                <button
                  onClick={clearFilters}
                  className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full text-sm font-medium shadow"
                >
                  Clear Filters
                </button>
                <button
                  onClick={applyFilters}
                  className="px-5 py-2 bg-crimson-700 hover:bg-crimson-800 text-white rounded-full text-sm font-medium shadow"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filters;