import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackendURLS from "../config";
import { Button, Spinner } from "@nextui-org/react";

// Import local fallback images
import maleAvatar from "../profiles/male.jpg";
import femaleAvatar from "../profiles/female.jpg";
import defaultAvatar from "../profiles/Not_Uploaded.jpg";

export default function ViewEmployeeByID() {
  const [employeeData, setEmployeeData] = useState(null);
  const [profile, setProfile] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          `${BackendURLS.Admin}/employeebyID/${id}`,
          {
            headers: { Authorization: sessionStorage.getItem("AdminToken") },
          }
        );
        setEmployeeData(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData(); // ✅ moved inside useEffect to avoid missing dependency warning
  }, [id]);

  useEffect(() => {
    if (!employeeData?.EmployeeID) return;

    const getProfile = async () => {
      try {
        const response = await axios.get(
          `${BackendURLS.Admin}/viewProfile/${employeeData.EmployeeID}`,
          {
            headers: { Authorization: sessionStorage.getItem("AdminToken") },
            responseType: "arraybuffer",
          }
        );

        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        setProfile(dataUrl);
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfile(""); // fallback
      }
    };
    getProfile(); // ✅ moved inside useEffect to fix missing dependency warning
  }, [employeeData]);

  const getAvatar = () => {
    if (profile && !profile.includes("Not_Uploaded")) return profile;
    if (employeeData?.EmployeeGender?.toLowerCase() === "male") return maleAvatar;
    if (employeeData?.EmployeeGender?.toLowerCase() === "female") return femaleAvatar;
    return defaultAvatar;
  };

  return (
    <div className="py-10">
      <div className="flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-lg p-6 w-full max-w-screen-lg"
        >
          <h1 className="text-3xl text-center font-semibold mb-4">
            Employee Profile
          </h1>

          {employeeData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Section */}
              <div className="text-center">
                <img
                  src={getAvatar()}
                  alt="Employee Avatar"
                  className="rounded-full mx-auto mb-4"
                  style={{ width: "150px", height: "150px" }}
                />
                <div className="text-gray-500">
                  <p>Name: {employeeData.EmployeeName}</p>
                  <p>Date of Birth: {employeeData.EmployeeDOB}</p>
                  <p>Gender: {employeeData.EmployeeGender}</p>
                  <p>Age: {employeeData.EmployeeAge}</p>
                  <p>Email: {employeeData.EmployeeMailID}</p>
                  <p>Contact: {employeeData.EmployeeContact}</p>
                </div>
              </div>

              {/* Work Info Section */}
              <div className="text-center">
                <div className="text-gray-500">
                  <p>Department: {employeeData.EmployeeDepartment}</p>
                  <p>Qualification: {employeeData.EmployeeQualification}</p>
                  <p>Salary: {employeeData.EmployeeSalary}</p>
                  <p>Location: {employeeData.EmployeeLocation}</p>
                </div>
                <div className="flex justify-center mt-4 gap-4">
                  <Button
                    onClick={() =>
                      navigate(`/admin/UpdateEmployee/${employeeData.EmployeeID}`)
                    }
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() =>
                      navigate(
                        `/admin/viewleaveHistory/${employeeData.EmployeeID}`
                      )
                    }
                  >
                    View Leave History
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Spinner size="lg" label="Loading...." />
          )}

          <div className="text-center mt-6">
            <Button
              color="secondary"
              variant="shadow"
              onClick={() => navigate(`/admin/viewemployees`)}
            >
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
