import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import ConfirmModal from "./ConfirmModal";

const PolicyTable = ({ policies, onDelete, onEdit }) => {
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize(); // set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sorted = [...policies].sort(
    (a, b) => new Date(b.issuedDate) - new Date(a.issuedDate)
  );

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const displayOrDash = (value) => value?.toString().trim() || "-";

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://policy-tracker-o1bg.onrender.com/api/policies/${String(deleteId)}`
      );
      onDelete(deleteId);
      setConfirmOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete policy. Try again.");
    }
  };

  const askDelete = (applicationNumber) => {
    setDeleteId(applicationNumber);
    setConfirmOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto pb-16"
    >
      {confirmOpen && (
        <ConfirmModal
          message="Are you sure you want to delete this policy?"
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* Cards for mobile and tablet */}
      {!isDesktop && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((p, idx) => (
            <div
              key={p.applicationNumber || idx}
              className="bg-white/90 backdrop-blur border border-gray-300 rounded-xl p-4 shadow-md"
            >
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span className="font-semibold text-crimson-700">#{idx + 1}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${p.status === "Issued"
                    ? "text-green-700"
                    : p.status === "Pending"
                      ? "text-yellow-700"
                      : "text-red-600"
                  }`}
                >
                  {displayOrDash(p.status)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm break-words">
                <div><strong>App No:</strong> {displayOrDash(p.applicationNumber)}</div>
                <div><strong>Policy No:</strong> {displayOrDash(p.policyNumber)}</div>
                <div><strong>Customer:</strong> {displayOrDash(p.customerName)}</div>
                <div><strong>Advisor:</strong> {displayOrDash(p.advisorName)}</div>
                <div><strong>FYFRP:</strong> ₹{p.fyfrp?.toLocaleString() || 0}</div>
                <div><strong>WFYFRP:</strong> ₹{p.wfyfrp?.toLocaleString() || 0}</div>
                <div><strong>Plan:</strong> {displayOrDash(p.planName)}</div>
                <div><strong>Mode:</strong> {displayOrDash(p.mode)}</div>
                <div><strong>Login Date:</strong> {formatDisplayDate(p.loginDate)}</div>
                <div><strong>Issue Date:</strong> {formatDisplayDate(p.issuedDate)}</div>
              </div>
              <div className="flex justify-end gap-4 mt-3">
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-700 hover:text-blue-900 text-sm"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => askDelete(p.applicationNumber)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table view for desktop */}
      {isDesktop && (
        <div className="overflow-x-auto rounded-2xl shadow-xl bg-white/90 backdrop-blur border border-gray-300 mt-4">
          <div className="min-w-[1000px]">
            <table className="min-w-full text-sm text-left text-gray-800 font-medium">
              <thead className="bg-gradient-to-r from-crimson-700 to-gray-800 text-white uppercase text-xs">
                <tr className="sticky top-0 z-10">
                  {[
                    "#", "App No.", "Policy No.", "Customer", "Advisor", "FYFRP",
                    "WFYFRP", "Plan", "Mode", "Login Date", "Issued Date", "Status", "Actions"
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3"
                      colSpan={h === "Actions" ? 2 : 1}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sorted.map((p, idx) => (
                  <tr key={p.applicationNumber || idx} className="hover:bg-gray-100 transition">
                    <td className="px-4 py-2 text-gray-500 font-semibold">{idx + 1}</td>
                    <td className="px-4 py-2">{displayOrDash(p.applicationNumber)}</td>
                    <td className="px-4 py-2">{displayOrDash(p.policyNumber)}</td>
                    <td className="px-4 py-2 break-words">{displayOrDash(p.customerName)}</td>
                    <td className="px-4 py-2 break-words">{displayOrDash(p.advisorName)}</td>
                    <td className="px-4 py-2 text-crimson-700 font-semibold">₹{p.fyfrp?.toLocaleString() || 0}</td>
                    <td className="px-4 py-2 text-crimson-700 font-semibold">₹{p.wfyfrp?.toLocaleString() || 0}</td>
                    <td className="px-4 py-2">{displayOrDash(p.planName)}</td>
                    <td className="px-4 py-2">{displayOrDash(p.mode)}</td>
                    <td className="px-4 py-2">{formatDisplayDate(p.loginDate)}</td>
                    <td className="px-4 py-2">{formatDisplayDate(p.issuedDate)}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full
                        ${p.status === "Issued"
                          ? "text-green-700"
                          : p.status === "Pending"
                            ? "text-yellow-700"
                            : "text-red-600"
                        }`}>
                        {displayOrDash(p.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="text-crimson-700 hover:text-crimson-900 transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => askDelete(p.applicationNumber)}
                        className="text-red-500 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PolicyTable;
