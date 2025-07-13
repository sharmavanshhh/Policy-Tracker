import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaArrowLeft, FaFilter, FaSignOutAlt } from "react-icons/fa";
import Dashboard from "./components/Dashboard";
import Filters from "./components/Filters";
import PolicyTable from "./components/PolicyTable";
import Summary from "./components/Summary";
import AddPolicyModal from "./components/AddPolicyModal";
import MessageModal from "./components/MessageModal";
import ConfirmModal from "./components/ConfirmModal";
import PinLogin from "./components/PinLogin";
import { motion, AnimatePresence } from "framer-motion";

const CORRECT_PIN = "1975"; // Replace with your actual PIN

function App() {
  const [policies, setPolicies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPolicy, setEditPolicy] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authenticated, setIsAuthenticated] = useState(false);
  const [showPinErrorModal, setShowPinErrorModal] = useState(false);



  const fetchPolicies = () => {
    axios
      .get("https://policy-tracker-o1bg.onrender.com/api/policies")
      .then((res) => {
        setPolicies(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Failed to fetch policies", err));
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handlePinSubmit = (pin) => {
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      setViewMode("dashboard");
    } else {
      setShowPinErrorModal(true); // show modal
    }
  };



  const handleFilterChange = ({ mode, advisor, month, search }) => {
    let data = [...policies];

    if (mode) data = data.filter((p) => p.mode === mode);
    if (advisor) data = data.filter((p) => p.advisorName === advisor);

    if (month) {
      const selectedMonth = parseInt(month);
      const selectedYear = new Date().getFullYear();

      data = data.filter((p) => {
        if (!p.issuedDate) return false;

        const issued = new Date(p.issuedDate);
        const issuedMonth = issued.getMonth() + 1;
        const issuedDay = issued.getDate();

        const monthsSince = selectedMonth - issuedMonth;
        const filterDate = new Date(selectedYear, selectedMonth - 1, issuedDay);
        const today = new Date();

        if (monthsSince < 0 || today < filterDate) return false;

        switch (p.mode) {
          case "Monthly":
            return monthsSince < 12;
          case "Quarterly":
            return monthsSince % 3 === 0 && monthsSince < 12;
          case "Half-Yearly":
            return monthsSince % 6 === 0 && monthsSince < 12;
          case "Yearly":
            return monthsSince === 0;
          default:
            return false;
        }
      });
    }

    if (search) {
      const lower = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.customerName.toLowerCase().includes(lower) ||
          (p.policyNumber && p.policyNumber.toString().toLowerCase().includes(lower)) ||
          (p.applicationNumber && p.applicationNumber.toString().toLowerCase().includes(lower))
      );
    }


    const unique = {};
    data.forEach((p) => {
      unique[p.applicationNumber] = p;
    });

    setFiltered(Object.values(unique));
    setFilters({ mode, advisor, month, search });
  };

  const handleDeletePolicy = (applicationNumber) => {
    setPolicies((prev) => prev.filter((p) => p.applicationNumber !== applicationNumber));
    setFiltered((prev) => prev.filter((p) => p.applicationNumber !== applicationNumber));
  };

  const handleEditPolicy = (policyObj) => {
    setEditPolicy(policyObj);
  };

  const calculateTotal = (data, field) => {
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return data.reduce((total, p) => {
      if (!p.issuedDate) return total;

      const issued = new Date(p.issuedDate);
      const issuedDate = new Date(issued.getFullYear(), issued.getMonth(), issued.getDate());
      if (currentDate < issuedDate) return total; // Not started yet

      const diffMonths = (now.getFullYear() - issued.getFullYear()) * 12 + (now.getMonth() - issued.getMonth());
      const dayPassed = now.getDate() >= issued.getDate();

      let factor = 0;
      switch (p.mode) {
        case "Monthly":
          factor = diffMonths + (dayPassed ? 1 : 0); // +1 to include current month
          break;

        case "Quarterly":
          factor = Math.floor((diffMonths + (dayPassed ? 1 : 0)) / 3) + 1;
          factor = Math.min(factor, 4); // Max 4 per year
          break;


        case "Half-Yearly":
          factor = Math.floor((diffMonths + (dayPassed ? 1 : 0)) / 6) + 1;
          factor = Math.min(factor, 2); // Max 2 in a year
          break;
        case "Yearly":
          factor = diffMonths >= 12 || (diffMonths === 11 && dayPassed) ? 2 : 1;
          break;

        default:
          factor = 0;
      }

      return total + factor * (parseInt(p[field]) || 0);
    }, 0);
  };



  const getMonthWiseTotal = (data, field, monthFilter) => {
    const selectedMonth = parseInt(monthFilter); // 1-12
    const selectedYear = new Date().getFullYear();
    const today = new Date();

    return data.reduce((total, p) => {
      if (!p.issuedDate) return total;

      const issued = new Date(p.issuedDate);
      const issuedMonth = issued.getMonth() + 1;
      const issuedYear = issued.getFullYear();
      const issuedDay = issued.getDate();

      const filterDate = new Date(selectedYear, selectedMonth - 1, issuedDay);
      if (today < filterDate || (issuedYear > selectedYear) || (issuedYear === selectedYear && issuedMonth > selectedMonth)) return total;

      const monthsSince =
        (selectedYear - issuedYear) * 12 + (selectedMonth - issuedMonth);

      switch (p.mode) {
        case "Monthly":
          return monthsSince < 12 ? total + (parseInt(p[field]) || 0) : total;

        case "Quarterly":
          return ([0, 3, 6, 9].includes(monthsSince))
            ? total + (parseInt(p[field]) || 0)
            : total;

        case "Half-Yearly":
          return monthsSince % 6 === 0 && monthsSince < 12
            ? total + (parseInt(p[field]) || 0)
            : total;

        case "Yearly": {
          if (selectedMonth === issuedMonth) {
            const issuedDateThisYear = new Date(selectedYear, issued.getMonth(), issuedDay);
            const issuedDateNextYear = new Date(issuedYear + 1, issued.getMonth(), issuedDay);
            let yearlyTotal = 0;
            // First year installment
            if (
              selectedYear === issuedYear &&
              today >= issuedDateThisYear
            ) {
              yearlyTotal += parseInt(p[field]) || 0;
            }
            // Second year installment (recurring)
            if (
              selectedYear === issuedYear + 1 &&
              today >= issuedDateNextYear
            ) {
              yearlyTotal += parseInt(p[field]) || 0;
            }
            return total + yearlyTotal;
          }
          return total;
        }
        default:
          return total;
      }
    }, 0);
  };


  const noFilters = !filters.mode && !filters.advisor && !filters.month && !filters.search;
  const isMonthFilter = !!filters.month;

  const totalFYFRP = isMonthFilter
    ? getMonthWiseTotal(filtered, "fyfrp", filters.month)
    : noFilters
      ? calculateTotal(policies, "fyfrp")
      : calculateTotal(filtered, "fyfrp");

  const totalWFYFRP = isMonthFilter
    ? getMonthWiseTotal(filtered, "wfyfrp", filters.month)
    : noFilters
      ? calculateTotal(policies, "wfyfrp")
      : calculateTotal(filtered, "wfyfrp");

  const toggleView = () => {
    setViewMode((prev) => (prev === "dashboard" ? "detailed" : "dashboard"));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput(""); // Optional: reset PIN input
    setViewMode("dashboard"); // Reset to dashboard on logout
  };


  {
    !authenticated && (
      <div className="h-screen w-screen fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 via-silver to-gray-100">
        <PinLogin onSubmit={handlePinSubmit} resetTrigger={showPinErrorModal} />
        {showPinErrorModal && (
          <MessageModal
            title="Incorrect PIN"
            message="Incorrect PIN. Please try again."
            onClose={() => setShowPinErrorModal(false)}
          />
        )}
      </div>
    )
  }



  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-200 via-silver to-gray-100 text-gray-900 font-sans px-2 sm:px-4 md:px-6 py-6 sm:py-10 mx-auto">
      {viewMode === "dashboard" && (
        <div className="w-full flex justify-end mb-4 mt-2 mr-2 px-2 sm:px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-crimson-800 hover:text-crimson-900 font-medium text-sm sm:text-base transition"
            title="Logout"
          >
            <FaSignOutAlt className="text-base text-lg" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}


      {viewMode === "dashboard" && (
        <Dashboard
          totalPolicies={policies.length}
          totalFYFRP={calculateTotal(policies, "fyfrp")}
          totalWFYFRP={calculateTotal(policies, "wfyfrp")}
          onViewDetails={toggleView}
        />
      )}

      {viewMode === "detailed" && (
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center gap-4 mb-10"
          >
            {/* Title */}
            <h2 className="text-2xl sm:text-4xl font-bold text-crimson-800 tracking-tight flex items-center gap-3 ml-4 sm:ml-0">
              Detailed Policy Data

            </h2>

            {/* Back Button (right) */}
            <div className="flex items-center">
              {/* Mobile: circular button */}
              <button
                onClick={toggleView}
                className="inline-flex sm:hidden items-center justify-center bg-gradient-to-r from-crimson-700 to-gray-800 text-white w-9 h-9 rounded-full shadow-md hover:bg-crimson-800 transition mr-2"
                aria-label="Back"
              >
                <FaArrowLeft className="text-base" />
              </button>

              {/* Desktop Back Button */}
              <button
                onClick={toggleView}
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-crimson-700 to-gray-800 text-white px-5 sm:px-8 py-3 text-sm sm:text-base rounded-md font-medium shadow-md transition"
              >
                <FaArrowLeft className="text-sm" /> Back to Dashboard
              </button>
            </div>
          </motion.div>



          {/* Filters */}
          <Filters
            policies={policies}
            onFilterChange={handleFilterChange}
            showModal={showFilterModal}
            setShowModal={setShowFilterModal}
          />

          {/* Summary */}
          <div className="mb-10">
            <Summary
              policies={filtered}
              totalPolicies={filtered.length}
              totalFYFRP={totalFYFRP}
              totalWFYFRP={totalWFYFRP}
            />
          </div>

          {/* Table */}
          <div className="mb-20">
            <PolicyTable
              policies={filtered}
              onDelete={handleDeletePolicy}
              onEdit={handleEditPolicy}
            />
          </div>

          {/* Floating Filter Button (Left) */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="fixed bottom-6 left-4 sm:bottom-8 sm:left-8 bg-gradient-to-r from-crimson-700 to-gray-800 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-xl flex items-center justify-center text-lg sm:text-xl transition"
            title="Open Filters"
          >
            <FaFilter />
          </button>

          {/* Floating Add Button (Right) */}
          <button
            onClick={() => setShowAddModal(true)}
            className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-crimson-700 to-gray-800 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-xl flex items-center justify-center text-xl sm:text-2xl transition"
            title="Add New Policy"
          >
            <FaPlus />
          </button>


          {/* Modals */}
          {showAddModal && (
            <AddPolicyModal onClose={() => setShowAddModal(false)} onAdded={fetchPolicies} />
          )}
          {editPolicy && (
            <EditPolicyModal policy={editPolicy} onClose={() => setEditPolicy(null)} onUpdated={fetchPolicies} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;