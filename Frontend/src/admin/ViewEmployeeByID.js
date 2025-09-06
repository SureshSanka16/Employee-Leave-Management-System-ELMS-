import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackendURLS from "../config";
import { Button, Spinner } from "@nextui-org/react";

export default function ViewEmployeeByID() {
  const [employeeData, setEmployeeData] = useState(null);
  const [profile, setProfile] = useState(""); // base64 or public fallback
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          `${BackendURLS.Admin}/employeebyID/${id}`,
          { headers: { Authorization: sessionStorage.getItem("AdminToken") } }
        );
        setEmployeeData(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, [id]);

  // Fetch employee profile image from backend
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

        setProfile(`data:image/jpeg;base64,${base64}`);
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfile(""); // fallback
      }
    };

    getProfile();
  }, [employeeData]);

  // Determine which avatar to show
  const getAvatar = () => {
    if (profile) return profile;
    if (employeeData?.EmployeeGender?.toLowerCase() === "male")
      return "/images/male.jpg";
    if (employeeData?.EmployeeGender?.toLowerCase() === "female")
      return "/images/female.jpg";
    return "/images/Not_Uploaded.jpg";
  };

  if (!employeeData) {
    return (
      <div className="flex justify-center items-center mt-20">
        <Spinner size="lg" label="Loading Employee Profile..." />
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-xl p-8 max-w-4xl w-full"
        >
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Employee Profile
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Profile Section */}
            <div className="text-center">
              <img
                src={getAvatar()}
                alt={employeeData.EmployeeName}
                className="rounded-full w-40 h-40 object-cover mx-auto mb-4 shadow-lg"
              />
              <div className="text-left space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {employeeData.EmployeeName}
                </p>
                <p>
                  <span className="font-semibold">Date of Birth:</span>{" "}
                  {employeeData.EmployeeDOB}
                </p>
                <p>
                  <span className="font-semibold">Gender:</span>{" "}
                  {employeeData.EmployeeGender}
                </p>
                <p>
                  <span className="font-semibold">Age:</span>{" "}
                  {employeeData.EmployeeAge}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {employeeData.EmployeeMailID}
                </p>
                <p>
                  <span className="font-semibold">Contact:</span>{" "}
                  {employeeData.EmployeeContact}
                </p>
              </div>
            </div>

            {/* Work Info Section */}
            <div className="text-left space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
                <p>
                  <span className="font-semibold">Department:</span>{" "}
                  {employeeData.EmployeeDepartment}
                </p>
                <p>
                  <span className="font-semibold">Qualification:</span>{" "}
                  {employeeData.EmployeeQualification}
                </p>
                <p>
                  <span className="font-semibold">Salary:</span>{" "}
                  {employeeData.EmployeeSalary}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {employeeData.EmployeeLocation}
                </p>
              </div>

              <div className="flex gap-4 justify-center md:justify-start mt-4">
                <Button
                  onClick={() =>
                    navigate(`/admin/UpdateEmployee/${employeeData.EmployeeID}`)
                  }
                  color="primary"
                  auto
                >
                  Update
                </Button>
                <Button
                  onClick={() =>
                    navigate(`/admin/viewleaveHistory/${employeeData.EmployeeID}`)
                  }
                  color="secondary"
                  auto
                >
                  View Leave History
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={() => navigate(`/admin/viewemployees`)}
              color="default"
              auto
            >
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
