import React, { useState } from "react";
import axios from "axios";
import { FaTimes, FaRegCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialForm = {
  applicationNumber: "",
  policyNumber: "",
  customerName: "",
  advisorName: "",
  fyfrp: "",
  wfyfrp: "",
  planName: "",
  mode: "",
  loginDate: null,
  issuedDate: null,
  status: "",
};

const modes = ["Yearly", "Half-Yearly", "Quarterly", "Monthly"];
const statuses = ["Pending", "Rejected", "Issued"];

const AddPolicyModal = ({ onClose, onAdded }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const today = new Date();
  const isIssued = form.status.toLowerCase() === "issued";

  const toTitleCase = (str) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "status" && value.toLowerCase() !== "issued" ? { issuedDate: null } : {}),
    }));
    if (error?.toLowerCase().includes(name.toLowerCase())) {
      setError("");
    }
  };

  const handleSelectChange = (selectedOption, { name }) => {
    const value = selectedOption?.value || "";
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "status" && value.toLowerCase() !== "issued" ? { issuedDate: null } : {}),
    }));
    if (error?.toLowerCase().includes(name.toLowerCase())) {
      setError("");
    }
  };

  const handleDateChange = (date, name) => {
    setForm((prev) => ({
      ...prev,
      [name]: date,
    }));
    if (error?.toLowerCase().includes(name.toLowerCase())) {
      setError("");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async () => {
    const requiredFields = ["applicationNumber", "customerName", "advisorName", "planName", "mode", "status"];
    if (isIssued) requiredFields.push("issuedDate");

    for (let field of requiredFields) {
      if (!form[field] || (typeof form[field] === "string" && !form[field].trim())) {
        return setError(`Please fill ${toTitleCase(field)}`);
      }
    }

    if (form.loginDate && form.loginDate > today) {
      return setError("Login date cannot be in the future.");
    }

    if (isIssued) {
      if (form.issuedDate > today) {
        return setError("Issued date cannot be in the future.");
      }
      if (form.loginDate && form.issuedDate < form.loginDate) {
        return setError("Issued date cannot be before login date.");
      }
    }

    const payload = {
      ...form,
      loginDate: form.loginDate ? form.loginDate.toISOString().split("T")[0] : null,
      issuedDate: isIssued ? form.issuedDate?.toISOString().split("T")[0] : "",
      fyfrp: parseInt(form.fyfrp || 0),
      wfyfrp: parseInt(form.wfyfrp || 0),
    };

    try {
      setLoading(true);
      await axios.post("https://policy-tracker-o1bg.onrender.com/api/policies", payload);
      onAdded();
      handleClose();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error?.toLowerCase().includes("application")) {
        setError("Application Number already exists. Please enter a unique one.");
      } else {
        setError("Failed to add policy. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#d1d5db",
      borderRadius: "0.375rem",
      borderColor: "#d1d5db",
      boxShadow: "none",
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      minHeight: "2.5rem",
      outline: "none",
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

  const DateInputWithIcon = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="w-full text-left bg-gray-300 text-gray-800 placeholder-neutral-800 px-3 py-2 pr-10 rounded-md focus:outline-none"
    >
      <span className={value ? "" : "text-neutral-800"}>{value || placeholder}</span>
      <FaRegCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 pointer-events-none" />
    </button>
  ));

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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white/90 backdrop-blur border-t border-gray-300 rounded-t-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto mx-auto w-full max-w-4xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-crimson-700">Add New Policy</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-red-600">
                <FaTimes />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm flex justify-between sticky top-0 z-10">
                <span>{error}</span>
                <button onClick={() => setError("")} className="text-red-600 hover:text-red-800">
                  <FaTimes />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Application Number", name: "applicationNumber", required: true },
                { label: "Policy Number", name: "policyNumber", type: "number" },
                { label: "Customer Name", name: "customerName", required: true },
                { label: "Advisor Name", name: "advisorName", required: true },
                { label: "FYFRP", name: "fyfrp", type: "number" },
                { label: "WFYFRP", name: "wfyfrp", type: "number" },
                { label: "Plan Name", name: "planName", required: true },
              ].map(({ label, name, type = "text", required }) => (
                <div key={name} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    type={type}
                    autoComplete="off"
                    className="bg-gray-300 text-gray-800 px-3 py-2 rounded-md focus:outline-none"
                  />
                </div>
              ))}

              {/* Login Date */}
              <div className="flex flex-col relative">
                <label className="text-sm font-medium text-gray-700 mb-1">Login Date</label>
                <DatePicker
                  selected={form.loginDate}
                  onChange={(date) => handleDateChange(date, "loginDate")}
                  dateFormat="yyyy-MM-dd"
                  maxDate={today}
                  placeholderText="Select Login Date"
                  popperPlacement="top-end"
                  customInput={<DateInputWithIcon />}
                />
              </div>

              {/* Mode */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Mode <span className="text-red-500">*</span></label>
                <Select
                  name="mode"
                  value={form.mode ? { value: form.mode, label: form.mode } : null}
                  onChange={handleSelectChange}
                  options={modes.map((m) => ({ value: m, label: m }))}
                  styles={customSelectStyles}
                  menuPlacement="auto"
                  placeholder="Select Mode"
                  isSearchable={false}
                />
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                <Select
                  name="status"
                  value={form.status ? { value: form.status, label: form.status } : null}
                  onChange={handleSelectChange}
                  options={statuses.map((s) => ({ value: s, label: s }))}
                  styles={customSelectStyles}
                  placeholder="Select Status"
                  menuPlacement="auto"
                  isSearchable={false}
                />
              </div>

              {/* Issued Date */}
              {isIssued && (
                <div className="flex flex-col sm:col-span-2 relative">
                  <label className="text-sm font-medium text-gray-700 mb-1">Issued Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    selected={form.issuedDate}
                    onChange={(date) => handleDateChange(date, "issuedDate")}
                    dateFormat="yyyy-MM-dd"
                    maxDate={today}
                    placeholderText="Select Issued Date"
                    customInput={<DateInputWithIcon />}
                    popperPlacement="top-end"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full text-sm font-medium shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2 bg-crimson-700 hover:bg-crimson-800 text-white rounded-full text-sm font-medium shadow"
              >
                {loading ? "Adding..." : "Add Policy"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddPolicyModal;
