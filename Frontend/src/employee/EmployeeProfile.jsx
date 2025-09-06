import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BackendURLS from "../config";
import "./style.EmployeeProfile.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Spinner } from "@nextui-org/react";

export default function EmployeeProfile() {
  const [employeeData, setEmployeeData] = useState(null);
  const [pwdBox, setPwdBox] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState("/profiles/Not_Uploaded.jpg"); // default fallback

  // Fetch employee data
  const fetchEmployeeData = async () => {
    try {
      const empdata = JSON.parse(sessionStorage.getItem("employee"));
      if (!empdata) return;

      setEmployeeData(empdata);

      // Use gender-based default first
      let defaultProfile =
        empdata.EmployeeGender === "Male"
          ? "/profiles/male.jpg"
          : "/profiles/female.jpg";

      // If backend has uploaded profile, fetch it
      if (empdata.EmployeeProfile && !empdata.EmployeeProfile.includes("Not_Uploaded")) {
        try {
          const response = await axios.get(
            `${BackendURLS.Employee}/viewProfile/${empdata.EmployeeID}`,
            {
              headers: { Authorization: sessionStorage.getItem("EmployeeToken") },
              responseType: "arraybuffer",
            }
          );

          const base64 = Buffer.from(response.data, "binary").toString("base64");
          const ext = response.headers["content-type"] || "image/jpeg";
          setProfile(`data:${ext};base64,${base64}`);
        } catch (error) {
          console.error("Error fetching profile from backend:", error);
          setProfile(defaultProfile);
        }
      } else {
        setProfile(defaultProfile); // fallback to gender-based
      }
    } catch (error) {
      console.error("Error fetching employee profile:", error);
      setProfile("/profiles/Not_Uploaded.jpg"); // fallback
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  // Change password
  const handleSetPassword = async () => {
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

    try {
      const response = await axios.post(
        `${BackendURLS.Employee}/ChangePassword/${employeeData.EmployeeID}`,
        { oldpwd: currentPassword, newpwd: newPassword },
        { headers: { Authorization: sessionStorage.getItem("EmployeeToken") } }
      );
      if (response.status === 200) {
        toast.success("Password changed successfully!", { theme: "colored" });
        setPwdBox(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data || "Error changing password");
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-screen-lg"
      >
        <h1 className="text-3xl text-center font-semibold mb-6">Employee Profile</h1>

        {!employeeData ? (
          <div className="flex justify-center">
            <Spinner size="lg" label="Loading..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Info */}
            <div className="text-center">
              <div className="card">
                <img
                  src={profile} // ✅ use profile state
                  alt="avatar"
                  className="rounded-full mx-auto mb-4"
                  style={{ width: "150px", height: "150px" }}
                />
                <div className="card-info">
                  <p>Name: {employeeData.EmployeeName}</p>
                  <p>DOB: {employeeData.EmployeeDOB}</p>
                  <p>Gender: {employeeData.EmployeeGender}</p>
                  <p>Age: {employeeData.EmployeeAge}</p>
                  <p>Email: {employeeData.EmployeeMailID}</p>
                  <p>Contact: {employeeData.EmployeeContact}</p>
                </div>
              </div>
            </div>

            {/* Work Info */}
            <div className="text-center">
              <div className="card">
                <div className="card-info">
                  <p>Department: {employeeData.EmployeeDepartment}</p>
                  <p>Qualification: {employeeData.EmployeeQualification}</p>
                  <p>Salary: {employeeData.EmployeeSalary}</p>
                  <p>Location: {employeeData.EmployeeLocation}</p>
                </div>
                <div className="flex justify-center mt-4 gap-4">
                  <button className="button" onClick={() => setPwdBox(true)}>
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Change Password Dialog */}
      <Dialog
        visible={pwdBox}
        onHide={() => setPwdBox(false)}
        header="Change Password"
        footer={
          <div align="center">
            <Button label="Change Password" onClick={handleSetPassword} />
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </Dialog>

      <ToastContainer />
    </div>
  );
}
