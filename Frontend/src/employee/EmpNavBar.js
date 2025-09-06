import React, { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import ApplyLeave from "./ApplyLeave";
import EmployeeHome from "./EmployeeHome";
import EmployeeProfile from "./EmployeeProfile";
import LeaveHistory1 from "./LeaveHistory";
import ViewLeave from "./ViewLeave";
import LeaveAnalysis from './LeaveAnalysis';
import PageNotFound from "./PageNotFound";
import BackendURLS from "../config";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function EmpNavBar({ setIsEmployeeLoggedIn }) {
  const navigate = useNavigate();
const [employee] = useState(() => JSON.parse(sessionStorage.getItem('employee')));
  const [profile, setProfile] = useState("");

  // Fetch profile image
  useEffect(() => {
    if (!employee) return setProfile("");
    axios.get(`${BackendURLS.Employee}/viewProfile/${employee.EmployeeID}`, {
      headers: { Authorization: sessionStorage.getItem('EmployeeToken') },
      responseType: "arraybuffer"
    })
    .then(response => {
      const base64 = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setProfile(`data:image/jpeg;base64,${base64}`);
    })
    .catch(() => setProfile(""));
  }, [employee]);

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("employee");
    sessionStorage.removeItem("isEmployeeLoggedIn");
    sessionStorage.removeItem("EmployeeToken");
    setIsEmployeeLoggedIn(false); // Switch back to main NavBar
    toast.success("Logged out successfully!", { theme: "colored", autoClose: 1000 });
    navigate("/", { replace: true }); // Redirect to MainHome
  };

  const navLinkClass = "text-white hover:text-pink-400 transition";

  return (
    <div className="relative min-h-screen">
      {/* Fixed Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4
                   bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg rounded-b-lg"
      >
        <div className="flex-1 flex items-center gap-4">
          <Link className={`${navLinkClass} font-bold text-xl`}>Employee Leave Management System</Link>
          <Link className={`${navLinkClass} font-semibold text-lg ml-60`}>Employee Portal</Link>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/employee/EmpHome" className={navLinkClass}>Home</Link></li>
            <li>
              <details style={{ zIndex: 999 }}>
                <summary className={`cursor-pointer ${navLinkClass}`}>Leave</summary>
                <ul className="p-2 bg-white/10 backdrop-blur-lg rounded-t-none">
                  <li><Link to="/employee/applyleave" className={navLinkClass}>Apply Leave</Link></li>
                  <li><Link to="/employee/leaverecords" className={navLinkClass}>Leave History</Link></li>
                </ul>
              </details>
            </li>
            <li><Link to="/employee/leaveAnalysis" className={navLinkClass}>Analysis</Link></li>
            {employee && <li><Link to="/employee/profile" className={navLinkClass}>Profile</Link></li>}
            {employee && <li><button onClick={handleLogout} className={navLinkClass}>Logout</button></li>}
          </ul>

          {/* Avatar */}
          {employee && profile && (
            <div className="dropdown dropdown-end ml-4">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full border-2 border-white">
                  <img alt="Profile" src={profile} />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Page Routes */}
      <div className="pt-28">
        <Routes>
          <Route path="/employee/EmpHome" element={<EmployeeHome />} exact/>
          <Route path="/employee/applyleave" element={<ApplyLeave />} exact/>
          <Route path="/employee/profile" element={<EmployeeProfile />} exact/>
          <Route path="/employee/leaverecords" element={<LeaveHistory1 />} exact/>
          <Route path="/employee/viewLeave/:ID" element={<ViewLeave />} exact/>
          <Route path="/employee/leaveAnalysis" element={<LeaveAnalysis />} exact/>
          <Route path="*" element={<PageNotFound />} exact/>
        </Routes>
      </div>
    </div>
  );
}
