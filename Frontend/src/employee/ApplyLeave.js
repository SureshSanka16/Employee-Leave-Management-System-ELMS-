import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import BackendURLS from "../config";
import { Input, Button, Select, SelectItem } from '@nextui-org/react';

export default function ApplyLeave() {
  const [empid, setEmpid] = useState("");
  const leaveTypeRef = useRef(null);
  const [formData, setFormData] = useState({
    EmployeeID: "",
    LeaveType: "",
    LeaveStart: "",
    LeaveEnd: "",
    LeaveMessage: ""
  });

  useEffect(() => {
    const empdata = JSON.parse(sessionStorage.getItem("employee"));
    setEmpid(empdata.EmployeeID);
    setFormData({ ...formData, EmployeeID: empdata.EmployeeID });
    // eslint-disable-next-line
  }, [empid]);

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BackendURLS.Employee}/applyleave/${empid}`,
        {
          LeaveType: formData.LeaveType,
          LeaveStart: formData.LeaveStart,
          LeaveEnd: formData.LeaveEnd,
          LeaveMessage: formData.LeaveMessage
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem('EmployeeToken')
          }
        }
      );

      if (response.status === 200) {
        toast.success("Leave Applied Successfully!", { theme: 'colored' });
        setFormData({
          EmployeeID: empid,
          LeaveType: "",
          LeaveStart: "",
          LeaveEnd: "",
          LeaveMessage: ""
        });
      }
    } catch (e) {
      console.log(e.message);
      toast.error(e.response?.data || e.message, { theme: 'colored' });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-md mt-5">
      <h2 className="text-2xl font-bold mb-6">Leave Application Form</h2>
      <form onSubmit={handleLeaveSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Select Leave Type
          </label>
          <Select
            ref={leaveTypeRef}
            className="w-full"
            value={formData.LeaveType}
            onChange={(e) => setFormData({ ...formData, LeaveType: e.target.value })}
            aria-label="Select Leave Type"
            required
          >
            <SelectItem key="" value={""}>Select Leave Type</SelectItem>
            <SelectItem key="Sick Leave" value={"Sick Leave"}>Sick Leave</SelectItem>
            <SelectItem key="Casual Leave" value={"Casual Leave"}>Casual Leave</SelectItem>
            <SelectItem key="Maternity Leave" value={"Maternity Leave"}>Maternity Leave</SelectItem>
            <SelectItem key="Medical Leave" value={"Medical Leave"}>Medical Leave</SelectItem>
            <SelectItem key="Compensated Casual Leave" value={"Compensated Casual Leave"}>Compensated Casual Leave</SelectItem>
            <SelectItem key="Half-Paid Leave" value={"Half-Paid Leave"}>Half-Paid Leave</SelectItem>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Leave Dates</label>
          <div className="flex items-center">
            <Input
              type="date"
              variant="outlined"
              className="w-full"
              value={formData.LeaveStart}
              onChange={(e) => setFormData({ ...formData, LeaveStart: e.target.value })}
              required
            />
            <span className="mx-2 my-auto">to</span>
            <Input
              type="date"
              variant="outlined"
              className="w-full ml-2"
              value={formData.LeaveEnd}
              onChange={(e) => setFormData({ ...formData, LeaveEnd: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Leave Message</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
            value={formData.LeaveMessage}
            onChange={(e) => setFormData({ ...formData, LeaveMessage: e.target.value })}
            required
          />
        </div>

        <div align="center">
          <Button variant="shadow" color="primary" type="submit" radius="full">
            Apply Leave
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
