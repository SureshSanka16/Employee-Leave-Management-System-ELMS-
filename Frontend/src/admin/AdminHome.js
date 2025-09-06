import React, { useState, useEffect } from "react";
import Typed from "typed.js";
import BackendURLS from "../config";
import axios from "axios";
import { motion } from "framer-motion";
import { Spinner } from "@nextui-org/react";
import bgImage from '../components/images/bg1.jpg'; // bg can stay in src

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

// Loader component
const Loader = () => (
  <div className="loader-container mt-3 flex justify-center">
    <Spinner size='lg' color="warning" label="Please Wait..." />
  </div>
);

export default function AdminHome() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`${BackendURLS.Admin}/leaveAnalysis`, {
        headers: {
          Authorization: sessionStorage.getItem('AdminToken')
        }
      });
      setAnalysis(response.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalysis(); }, []);

  useEffect(() => {
    const admin = JSON.parse(sessionStorage.getItem("admin"));
    const typed = new Typed("#typed-text", {
      strings: [`Welcome, ${admin.username}`],
      typeSpeed: 50,
      loop: false,
    });
    const typed1 = new Typed("#typed-text2", {
      strings: ["This is Admin Portal"],
      typeSpeed: 50,
      loop: false,
    });
    return () => { typed.destroy(); typed1.destroy(); };
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
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
          src="/images/21.jpg"  // ✅ Updated to public folder path
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
              <AnalysisCard title="Employee Count" value={analysis.EmployeeCount} />
              <AnalysisCard title="Total Leaves" value={analysis.LeaveCount} />
              <AnalysisCard title="Pending Leaves" value={analysis.LeavePendingCount} />
              <AnalysisCard title="Approved Leaves" value={analysis.LeaveApprovedCount} />
              <AnalysisCard title="Rejected Leaves" value={analysis.LeaveRejectedCount} />
            </>
          )
        )}
      </div>
    </div>
  );
}
