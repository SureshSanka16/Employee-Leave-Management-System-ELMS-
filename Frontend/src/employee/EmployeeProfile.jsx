import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.EmployeeProfile.css";

export default function EmployeeProfile() {
  const [employeeData, setEmployeeData] = useState(null);
  const [pwdBox, setPwdBox] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState("/images/male.jpg"); // default fallback

  // Load employee data from session
  useEffect(() => {
    const empdata = JSON.parse(sessionStorage.getItem("employee"));
    if (!empdata) return;

    setEmployeeData(empdata);

    const genderProfile =
      empdata.EmployeeGender.toLowerCase() === "male"
        ? "/images/male.jpg"
        : "/images/female.jpg";

    setProfile(genderProfile);
  }, []);

  // Change password handler
  const handleSetPassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("All fields must be filled", { theme: "colored" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { theme: "colored" });
      return;
    }
    if (newPassword.length < 8) {
      toast.warning("Password must be at least 8 characters", { theme: "colored" });
      return;
    }

    // Call backend API here if needed
    toast.success("Password changed successfully!", { theme: "colored" });
    setPwdBox(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (!employeeData) {
    return (
      <div className="flex justify-center mt-20">
        <p className="text-gray-500 text-lg">Loading Employee Profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-6 max-w-screen-lg mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-8">Employee Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="flex flex-col items-center">
            <img
              src={profile}
              alt={employeeData.EmployeeName}
              className="rounded-full w-36 h-36 object-cover mb-4 shadow-md"
            />
            <div className="space-y-2 text-center text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> {employeeData.EmployeeName}
              </p>
              <p>
                <span className="font-semibold">DOB:</span> {employeeData.EmployeeDOB}
              </p>
              <p>
                <span className="font-semibold">Gender:</span> {employeeData.EmployeeGender}
              </p>
              <p>
                <span className="font-semibold">Age:</span> {employeeData.EmployeeAge}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {employeeData.EmployeeMailID}
              </p>
              <p>
                <span className="font-semibold">Contact:</span> {employeeData.EmployeeContact}
              </p>
            </div>
          </div>

          {/* Work Info Section */}
          <div className="text-left space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
              <p>
                <span className="font-semibold">Department:</span> {employeeData.EmployeeDepartment}
              </p>
              <p>
                <span className="font-semibold">Qualification:</span> {employeeData.EmployeeQualification}
              </p>
              <p>
                <span className="font-semibold">Salary:</span> {employeeData.EmployeeSalary}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {employeeData.EmployeeLocation}
              </p>
            </div>

            <div className="flex gap-4 justify-center md:justify-start mt-4">
              <Button
                onClick={() => console.log("Redirect to Update Employee")}
                color="primary"
                auto
              >
                Update
              </Button>
              <Button
                onClick={() => console.log("Redirect to View Leave History")}
                color="secondary"
                auto
              >
                View Leave History
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Change Password Dialog */}
      <Dialog
        visible={pwdBox}
        onHide={() => setPwdBox(false)}
        header="Change Password"
        className="w-full max-w-md"
        footer={
          <div className="flex justify-center">
            <Button label="Change Password" onClick={handleSetPassword} />
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input-field"
          />
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />
        </div>
      </Dialog>

      <ToastContainer />
    </div>
  );
}
