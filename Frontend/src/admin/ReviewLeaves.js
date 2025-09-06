import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import BackendURLS from './../config';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Progress, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Link } from "@nextui-org/react";
import PendingImage from './images/pending.png';
import ApprovedImage from './images/approved.png';
import RejectedImage from './images/rejected.png';

export default function ReviewLeaves() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [RBox, setRBox] = useState(false);
  const [ABox, setABox] = useState(false);
  const [profile, setProfile] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { ID } = useParams();

  // Fetch leave requests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(`${BackendURLS.Admin}/viewLeaveByLID/${ID}`, {
          headers: { Authorization: sessionStorage.getItem('AdminToken') }
        });
        setLeaveRequests(response.data);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        toast.error('Failed to fetch leave requests');
      }
    };
    fetchLeaveRequests();
  }, [ID]);

  // Fetch medical letter
  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await axios.get(`${BackendURLS.Admin}/viewLetterByLID/${ID}`, {
          responseType: 'blob',
          headers: { Authorization: sessionStorage.getItem('AdminToken') }
        });
        const contentType = response.headers['content-type'];
        let fileUrl = '';
        if (contentType.includes('pdf')) {
          fileUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
          fileUrl = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
        }
        setUrl(fileUrl);
      } catch (err) {
        console.error('Error fetching letter:', err);
      }
    };
    fetchLetter();
  }, [ID]);

  // Fetch profile image
  useEffect(() => {
    const getProfile = async (employeeID) => {
      try {
        const response = await axios.get(`${BackendURLS.Admin}/viewProfile/${employeeID}`, {
          headers: { Authorization: sessionStorage.getItem('AdminToken') },
          responseType: 'arraybuffer'
        });
        const base64 = btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        setProfile(`data:image/jpeg;base64,${base64}`);
        setProfileLoading(false);
      } catch (error) {
        console.error('Error fetching profile image:', error);
        setProfileLoading(false);
      }
    };

    if (leaveRequests.EmployeeID) {
      getProfile(leaveRequests.EmployeeID);
    }
  }, [leaveRequests.EmployeeID]);

  const handleApprove = async (leaveID) => {
    try {
      await axios.put(`${BackendURLS.Admin}/approve/${leaveID}`, null, {
        headers: { Authorization: sessionStorage.getItem('AdminToken') }
      });
      toast.success('Leave approved successfully', { theme: 'colored' });
      setABox(false);
      // Refresh leave requests
      const response = await axios.get(`${BackendURLS.Admin}/viewLeaveByLID/${ID}`, {
        headers: { Authorization: sessionStorage.getItem('AdminToken') }
      });
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error approving leave:', error);
      toast.error(error.response?.data || 'Error approving leave', { theme: 'colored' });
    }
  };

  const handleReject = async (leaveID) => {
    try {
      await axios.put(`${BackendURLS.Admin}/reject/${leaveID}`, null, {
        headers: { Authorization: sessionStorage.getItem('AdminToken') }
      });
      toast.success('Leave rejected successfully', { theme: 'colored' });
      setRBox(false);
      // Refresh leave requests
      const response = await axios.get(`${BackendURLS.Admin}/viewLeaveByLID/${ID}`, {
        headers: { Authorization: sessionStorage.getItem('AdminToken') }
      });
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error rejecting leave:', error);
      toast.error(error.response?.data || 'Error rejecting leave', { theme: 'colored' });
    }
  };

  const renderMedicalLetterLink = () => {
    if (leaveRequests.MedicalLetter === "Not Available") {
      return <p className="text-gray-700 mb-2">Medical Letter: Not Applicable</p>;
    }
    return (
      <p className="text-gray-700 mb-2">
        Medical Letter:
        <Link href={url} isBlock showAnchorIcon color="warning" target="_blank">View Letter</Link>
        <Link href={url} title="Download Letter" isBlock color="success" download={`${leaveRequests.LeaveID}`}>Download Letter &#10515;</Link>
      </p>
    );
  };

  const renderStatusImage = () => {
    switch (leaveRequests.LeaveStatus) {
      case 'Pending': return <img src={PendingImage} alt="Pending Status" className="w-30 h-24" />;
      case 'Approved': return <img src={ApprovedImage} alt="Approved Status" className="w-30 h-24" />;
      case 'Rejected': return <img src={RejectedImage} alt="Rejected Status" className="w-30 h-24" />;
      default: return null;
    }
  };

  const renderStatusText = () => {
    if (leaveRequests.LeaveStatus === 'Approved') return <p className="text-gray-700 mb-2">Leave-Status: {leaveRequests.LeaveStatus} &#9989;</p>;
    if (leaveRequests.LeaveStatus === 'Rejected') return <p className="text-gray-700 mb-2">Leave-Status: {leaveRequests.LeaveStatus} &#10060;</p>;
    return <p className="text-gray-700 mb-2">Leave-Status: {leaveRequests.LeaveStatus}</p>;
  };

  const renderActionButtons = () => {
    if (leaveRequests.LeaveStatus === "Pending") {
      return (
        <div align="center">
          <Button radius="full" color="success" variant="shadow" onClick={() => setABox(true)}>Approve</Button>
          &nbsp;&nbsp;
          <Button radius="full" color="danger" variant="shadow" onClick={() => setRBox(true)}>Reject</Button>
          &nbsp;&nbsp;
          <Button radius="full" color="secondary" variant="shadow" onClick={() => navigate(`/admin/viewleaves`)}>Go Back</Button>
        </div>
      );
    } else if (leaveRequests.LeaveStatus === "Approved") {
      return (
        <div align="center">
          <Button radius="full" color="success" variant="shadow" isDisabled>Already Approved</Button>
          &nbsp;&nbsp;
          <Button radius="full" color="secondary" variant="shadow" onClick={() => navigate(`/admin/viewleaves`)}>Go Back</Button>
        </div>
      );
    } else {
      return (
        <div align="center">
          <Button radius="full" color="danger" variant="shadow" isDisabled>Already Rejected</Button>
          &nbsp;&nbsp;
          <Button radius="full" color="secondary" variant="shadow" onClick={() => navigate(`/admin/viewleaves`)}>Go Back</Button>
        </div>
      );
    }
  };

  const calculateLeaveDuration = () => {
    if (!leaveRequests.LeaveStart || !leaveRequests.LeaveEnd) return { days: 0, months: 0 };
    const [startDay, startMonth, startYear] = leaveRequests.LeaveStart.split('-').map(Number);
    const [endDay, endMonth, endYear] = leaveRequests.LeaveEnd.split('-').map(Number);
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const diffInMonths = end.getMonth() - start.getMonth() + 12 * (end.getFullYear() - start.getFullYear());
    return { days: diffInDays, months: diffInMonths };
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-5">Review Leave Request</h1>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-8 rounded-lg shadow-md mx-5">
        {leaveRequests ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-4">
                  {profileLoading ? <Spinner /> : <img src={profile} alt="Employee Profile" className="w-24 h-24 rounded-full" />}
                  {renderStatusImage()}
                </div>
                <div className="mt-4">
                  <p className="text-gray-700 mb-2">Leave ID: {leaveRequests.LeaveID}</p>
                  <p className="text-gray-700 mb-2">Employee ID: {leaveRequests.EmployeeID}</p>
                  <p className="text-gray-700 mb-2">Employee Name: {leaveRequests.EmployeeName}</p>
                  <p className="text-gray-700 mb-2">Leave Type: {leaveRequests.LeaveType}</p>
                  {renderStatusText()}
                </div>
              </div>
              <div>
                <p className="text-gray-700 mb-2">LeaveStart: {leaveRequests.LeaveStart}</p>
                <p className="text-gray-700 mb-2">LeaveEnd: {leaveRequests.LeaveEnd}</p>
                <p className="text-gray-700 mb-2">Leave Duration: {calculateLeaveDuration().days} days / {calculateLeaveDuration().months} months</p>
                <div className="mb-2">
                  <p className="text-gray-700">LeaveMessage:</p>
                  <textarea value={leaveRequests.LeaveMessage} disabled className="w-full h-24 p-2 border rounded-md bg-gray-100" />
                </div>
                {renderMedicalLetterLink()}
              </div>
            </div>
            {renderActionButtons()}
          </div>
        ) : (
          <Progress size="sm" label="Loading..." isIndeterminate aria-label="Loading..." className="max-w-md mx-auto block" />
        )}
      </motion.div>

      <ToastContainer />

      {/* Approve Modal */}
      <Modal backdrop="blur" isOpen={ABox} onClose={() => setABox(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Approval Alert</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to approve the leave (LID: {leaveRequests.LeaveID}) of employee (EID: {leaveRequests.EmployeeID})?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                <Button color="success" onPress={() => handleApprove(leaveRequests.LeaveID)}>Confirm</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Reject Modal */}
      <Modal backdrop="blur" isOpen={RBox} onClose={() => setRBox(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Rejection Alert</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to reject the leave (LID: {leaveRequests.LeaveID}) of employee (EID: {leaveRequests.EmployeeID})?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={() => handleReject(leaveRequests.LeaveID)}>Confirm</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
