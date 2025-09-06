// AdminNavBar.js
import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Checkbox, Button } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import AdminHome from "../admin/AdminHome";
import AddEmployee from "../admin/AddEmployee";
import ViewEmployees from "../admin/ViewEmployees";
import ViewEmployeeByID from "../admin/ViewEmployeeByID";
import ViewLeaves from "../admin/ViewLeaves";
import UpdateEmployeeByID from './UpdateEmployeeByID';
import LeaveAnalysis from './LeaveAnalysis';
import ReviewLeaves from './ReviewLeaves';
import LeaveHistoryByEID from './LeaveHistoryByEID';
import PageNotFound from './PageNotFound';
import BackendURLS from "../config";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function AdminNavBar() {
  const [box, setBox] = useState(false);
  const [oldpwd, setOldpwd] = useState('');
  const [newpwd, setNewpwd] = useState('');
  const [conpwd, setConpwd] = useState('');
  const [uname, setUname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem('admin'));
    if (adminData && adminData.username) setUname(adminData.username);
  }, []);

  const handleChangePassword = async () => {
    try {
      if (!oldpwd || !newpwd || !conpwd) {
        toast.warning("All fields must be filled", { theme: 'colored' });
        return;
      }
      if (newpwd !== conpwd) {
        toast.error("New Password and Confirm Password must match", { theme: 'colored' });
        return;
      }

      const data = { newpwd, oldpwd };
      const response = await axios.post(
        `${BackendURLS.Admin}/ChangePassword/${uname}`,
        data,
        { headers: { Authorization: sessionStorage.getItem('AdminToken') } }
      );
      if (response.status === 200) {
        toast.success("Password changed successfully!", { autoClose: 1200, theme: 'colored' });
        setTimeout(() => setBox(false), 1200);
      }
    } catch (e) {
      toast.error(e.response?.data || "Error changing password", { theme: 'colored' });
    }
  };

  const ShowPassword = () => {
    const pwd1 = document.getElementById('oldpwd');
    const pwd2 = document.getElementById('newpwd');
    const pwd3 = document.getElementById('con');
    const type = pwd1.type === 'password' ? 'text' : 'password';
    pwd1.type = pwd2.type = pwd3.type = type;
  };

   const handleLogout = ()=>{
    sessionStorage.removeItem("isAdminLoggedIn")
    sessionStorage.removeItem("admin")
    sessionStorage.removeItem("AdminToken")
     toast.success("Admin Logged out successfully!", {
                theme: "colored",
                autoClose: 1000,
              });
    
    navigate('/adminlogin')
    window.location.reload()
  }


  // reusable class for navbar links
  const navLinkClass = "text-white hover:text-pink-400 focus:text-pink-400 active:text-pink-400 visited:text-white transition";

  return (
    <div className="relative min-h-screen">
      {/* Fixed Glass Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4
                   bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg rounded-b-lg"
      >
        <div className="flex-1 flex items-center gap-4">
          <Link className={`${navLinkClass} font-bold text-xl`}>Employee Leave Management System</Link>
          <Link className={`${navLinkClass} font-semibold text-lg ml-60`}>Admin Portal</Link>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 text-white">
            <li><Link to="/admin/AdminHome" className={navLinkClass}>Home</Link></li>
            <li>
              <details style={{ zIndex: 999 }}>
                <summary className={`cursor-pointer ${navLinkClass}`}>Employee</summary>
                <ul className="p-2 bg-white/10 backdrop-blur-lg rounded-t-none">
                  <li><Link to="/admin/addemployee" className={navLinkClass}>Add Employee</Link></li>
                  <li><Link to="/admin/viewemployees" className={navLinkClass}>View Employees</Link></li>
                </ul>
              </details>
            </li>
            <li>
              <details style={{ zIndex: 999 }}>
                <summary className={`cursor-pointer ${navLinkClass}`}>Leave</summary>
                <ul className="p-2 bg-white/10 backdrop-blur-lg rounded-t-none">
                  <li><Link to="/admin/viewleaves" className={navLinkClass}>Leaves Applied</Link></li>
                  <li><Link to="/admin/leaveAnalysis" className={navLinkClass}>Leave Analysis</Link></li>
                </ul>
              </details>
            </li>
            <li><Link onClick={() => setBox(true)} className={navLinkClass}>Change Password</Link></li>
            <li><Link onClick={handleLogout} className={navLinkClass}>Logout</Link></li>
          </ul>
        </div>
      </motion.nav>

      {/* Page Routes */}
      <div className="pt-28">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/admin/AdminHome" element={<AdminHome />} exact />
          <Route path="/admin/addemployee" element={<AddEmployee />} exact />
          <Route path="/admin/viewemployees" element={<ViewEmployees />} exact />
          <Route path="/admin/viewEmployee/:id" element={<ViewEmployeeByID />} exact />
          <Route path="/admin/UpdateEmployee/:id" element={<UpdateEmployeeByID />} exact />
          <Route path="/admin/viewleaves" element={<ViewLeaves />} exact />
          <Route path="/admin/leaveAnalysis" element={<LeaveAnalysis />} exact />
          <Route path="/admin/ReviewLeave/:ID" element={<ReviewLeaves />} exact />
          <Route path="/admin/viewleavehistory/:id" element={<LeaveHistoryByEID />} />
          <Route path="*" element={<PageNotFound />} exact />
        </Routes>
      </div>

      {/* Change Password Modal */}
      <Modal backdrop={"blur"} isOpen={box} onClose={() => setBox(false)}>
        <ModalContent className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
          <ModalHeader className="text-xl text-white font-semibold">Change Password</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <input
              id="oldpwd"
              placeholder="Enter Current Password"
              type="password"
              onChange={(e) => setOldpwd(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <input
              id="newpwd"
              placeholder="Enter New Password"
              type="password"
              onChange={(e) => setNewpwd(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <input
              id="con"
              placeholder="Re-enter New Password"
              type="password"
              onChange={(e) => setConpwd(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <Checkbox id="check" onClick={ShowPassword} className="text-white">Show Password</Checkbox>
          </ModalBody>
          <ModalFooter className="flex justify-between">
            <Button color="danger" variant="light" onPress={() => setBox(false)}>Cancel</Button>
            <Button color="primary" onPress={handleChangePassword}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
        <ToastContainer />
      </Modal>
    </div>
  );
}
