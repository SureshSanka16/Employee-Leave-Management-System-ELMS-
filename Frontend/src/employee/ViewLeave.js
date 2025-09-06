import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BackendURLS from "../config";
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Progress, Button } from "@nextui-org/react";
import PendingImage from './images/pending.png';
import ApprovedImage from './images/approved.png';
import RejectedImage from './images/rejected.png';
import { Link } from '@nextui-org/react';

export default function ViewLeave() {
  const [leaveRequests, setLeaveRequests] = useState(null);
  const [url, setUrl] = useState('');
  const [profile, setProfile] = useState('');
  const navigate = useNavigate();
  const { ID } = useParams();

  // Fetch leave request details
  const fetchLeaveRequests = useCallback(async () => {
    const empid = JSON.parse(sessionStorage.getItem('employee')).EmployeeID;
    try {
      const response = await axios.get(`${BackendURLS.Employee}/viewLeaveByLID/${empid}/${ID}`, {
        headers: { Authorization: sessionStorage.getItem('EmployeeToken') }
      });
      setLeaveRequests(response.data);

      // Fetch profile image
      const res = await axios.get(`${BackendURLS.Employee}/viewProfile/${empid}`, {
        headers: { Authorization: sessionStorage.getItem('EmployeeToken') },
        responseType: 'arraybuffer'
      });
      const base64 = btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      setProfile(`data:image/jpeg;base64,${base64}`);
    } catch (error) {
      console.error('Error fetching leave requests or profile:', error);
    }
  }, [ID]);

  // Fetch medical letter URL
  const fetchLetter = useCallback(async () => {
    try {
      const response = await axios.get(`${BackendURLS.Employee}/viewLetterByLID/${ID}`, {
        responseType: 'blob',
        headers: { Authorization: sessionStorage.getItem('EmployeeToken') }
      });
      const contentType = response.headers['content-type'];
      let url;
      if (contentType.includes('pdf')) {
        url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      } else if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
        url = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
      } else {
        console.error('Unsupported content type:', contentType);
        return;
      }
      setUrl(url);
    } catch (err) {
      console.error('Error fetching letter:', err);
    }
  }, [ID]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  useEffect(() => {
    fetchLetter();
  }, [fetchLetter]);

  const renderMedicalLetterLink = () => {
    if (leaveRequests?.MedicalLetter === "Not Available") {
      return <p className="text-gray-700 mb-2">Medical Letter: Not Applicable</p>;
    }
    return (
      <p className="text-gray-700 mb-2">
        Medical Letter:
        <Link href={url} title="View Letter" isBlock showAnchorIcon color="warning" target='_blank'>
          View Letter
        </Link>
        <Link href={url} title="Download Letter" isBlock color="success" download={`${leaveRequests.LeaveID}`}>
          Download Letter &#10515;
        </Link>
      </p>
    );
  };

  const renderStatusImage = () => {
    if (leaveRequests?.LeaveStatus === "Pending") return <img src={PendingImage} alt="Pending" className="w-30 h-24" />;
    if (leaveRequests?.LeaveStatus === "Approved") return <img src={ApprovedImage} alt="Approved" className="w-30 h-24" />;
    return <img src={RejectedImage} alt="Rejected" className="w-30 h-24" />;
  };

  const renderStatusText = () => {
    if (leaveRequests?.LeaveStatus === "Approved") return <p className="text-gray-700 mb-2">Leave-Status: {leaveRequests.LeaveStatus} &#9989;</p>;
    if (leaveRequests?.LeaveStatus === "Rejected") return <p className="text-gray-700 mb-2">Leave-Status: {leaveRequests.LeaveStatus} &#10060;</p>;
    return <p className="text-gray-700 mb-2">Leave-Status: {leaveRequests?.LeaveStatus}</p>;
  };

  const calculateLeaveDuration = () => {
    if (!leaveRequests?.LeaveStart || !leaveRequests?.LeaveEnd) return { days: 0, months: 0 };
    const startParts = leaveRequests.LeaveStart.split('-').map(Number);
    const endParts = leaveRequests.LeaveEnd.split('-').map(Number);
    const start = new Date(startParts[2], startParts[1] - 1, startParts[0]);
    const end = new Date(endParts[2], endParts[1] - 1, endParts[0]);
    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const diffInMonths = end.getMonth() - start.getMonth() + (12 * (end.getFullYear() - start.getFullYear()));
    return { days: diffInDays, months: diffInMonths };
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-5">View Leave</h1>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md mx-5"
      >
        {leaveRequests ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-container">
                  <div className="card">
                    <div className="flex items-center">
                      <img src={profile} alt="Employee Profile" className="w-24 h-24 rounded-full mr-4" />
                      <div className="ml-4">{renderStatusImage()}</div>
                    </div>
                    <br /><br />
                    <div className="card-info">
                      <p className="text-gray-700 mb-2">Leave ID: {leaveRequests.LeaveID}</p>
                      <p className="text-gray-700 mb-2">Employee ID: {leaveRequests.EmployeeID}</p>
                      <p className="text-gray-700 mb-2">Employee Name: {leaveRequests.EmployeeName}</p>
                      <p className="text-gray-700 mb-2">Leave Type: {leaveRequests.LeaveType}</p>
                      {renderStatusText()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="card">
                  <div className="card-info">
                    <p className="text-gray-700 mb-2">LeaveAppliedOn: {leaveRequests.LeaveAppliedOn}</p>
                    <p className="text-gray-700 mb-2">LeaveStart: {leaveRequests.LeaveStart}</p>
                    <p className="text-gray-700 mb-2">LeaveEnd: {leaveRequests.LeaveEnd}</p>
                    <p className="text-gray-700 mb-2">
                      Leave Duration: {calculateLeaveDuration().days} days / {calculateLeaveDuration().months} months
                    </p>
                    <div className="mb-2">
                      <p className="text-gray-700">LeaveMessage:</p>
                      <textarea value={leaveRequests.LeaveMessage} disabled className="w-full h-24 p-2 border rounded-md bg-gray-100" />
                    </div>
                    {renderMedicalLetterLink()}
                  </div>
                </div>
              </div>
            </div>
            <div align="center">
              <Button variant='shadow' color='secondary' onClick={() => navigate(`/employee/leaverecords`)}>Go Back</Button>
            </div>
          </div>
        ) : (
          <Progress size="sm" label="Loading..." isIndeterminate aria-label="Loading..." className="max-w-md mx-auto block" />
        )}
      </motion.div>
    </div>
  );
}
