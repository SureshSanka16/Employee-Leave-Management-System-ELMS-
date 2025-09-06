import React, { useEffect, useState } from "react";
import Typed from "typed.js";
import axios from "axios";
import BackendURLS from "../config";
import image21 from '../components/images/21.png';
import bgImage from '../components/images/bg1.jpg';
import { motion } from 'framer-motion';
import { Spinner } from "@nextui-org/react";

// Loader component
const Loader = () => (
  <div className="loader-container mt-6 flex justify-center">
    <Spinner size='lg' color="warning" label="Please Wait..." />
  </div>
);

// Analysis Card component
const AnalysisCard = ({ title, value }) => (
  <motion.div
    className="border rounded-md p-6 m-4 bg-white/10 backdrop-blur-lg shadow-lg"
    whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)" }}
    transition={{ duration: 0.2 }}
  >
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    <p className="text-xl font-bold text-white text-center">{value}</p>
  </motion.div>
);

export default function EmployeeHome() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    const empid = JSON.parse(sessionStorage.getItem("employee")).EmployeeID;
    try {
      const response = await axios.get(
        `${BackendURLS.Employee}/leaveAnalysis/${empid}`,
        {
          headers: {
            Authorization: sessionStorage.getItem("EmployeeToken"),
          },
        }
      );
      setAnalysis(response.data);
    } catch (error) {
      console.log("Error fetching analysis:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const employee = JSON.parse(sessionStorage.getItem("employee")).EmployeeName;

    const typed = new Typed("#typed-text", {
      strings: [`Welcome, ${employee}`],
      typeSpeed: 50,
      loop: false,
    });

    const typed1 = new Typed("#typed-text2", {
      strings: ["This is Employee Portal"],
      typeSpeed: 50,
      loop: false,
    });

    fetchAnalysis();

    return () => {
      typed.destroy();
      typed1.destroy();
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Typed Welcome Text */}
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold text-white">
          <span id="typed-text"></span>
        </h1>
        <h2 className="text-xl mt-2 text-gray-200">
          <span id="typed-text2"></span>
        </h2>
      </div>

      {/* Main Image */}
      <div className="flex justify-center mt-8">
        <img
          src={image21}
          alt="Employee Leave Management System"
          className="max-w-lg w-full h-auto rounded-lg shadow-2xl"
        />
      </div>

      {/* Analysis Cards */}
      <div className="flex flex-wrap justify-center mt-12 mb-10 w-full px-4">
        {loading ? (
          <Loader />
        ) : (
          analysis && (
            <>
              <AnalysisCard title="Total Leaves Taken" value={analysis.LeaveCount} />
              <AnalysisCard title="Casual Leave" value={analysis.CasualLeaveCount} />
              <AnalysisCard title="Sick Leave" value={analysis.SickLeaveCount} />
              <AnalysisCard title="Medical Leave" value={analysis.MedicalLeaveCount} />
              <AnalysisCard title="Compensated Casual Leave" value={analysis.CompensatedCasualLeaveCount} />
              <AnalysisCard title="Half Paid Leave" value={analysis.HalfPaidLeaveLeaveCount} />
            </>
          )
        )}
      </div>
    </div>
  );
}
