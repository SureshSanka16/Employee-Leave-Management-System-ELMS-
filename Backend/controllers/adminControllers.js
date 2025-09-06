
const AdminModel = require('../models/AdminModel');
const EmployeeModel = require('../models/EmployeeModel');
const LeaveApplicationModel = require('../models/LeaveApplication')
const sendMail = require('../utils/SendConfirmMail');
const sendApproveMail = require('../utils/SendApproveMail')
const sendRejectMail = require('../utils/SendRejectMail');
const {generateToken}=require('../utils/Auth');

const checkAdminLogin = async (req, res) => {
    try {
        const input = req.body; 
        //console.log(input);
        const a = await AdminModel.findOne(input);
        //console.log(a);
        if (a != null) {
            const admin = await AdminModel.findOne({ username: input.username }, { _id:0, password:0});
            const username = admin.username
            const token = generateToken({ username, role: "admin" });
            res.status(200).json({admin,token});
        } else {
            res.status(404).send("Invalid username or password");
        }
    } catch (e) {
        console.log(e); 
        res.status(500).send("Internal Server Error"); 
    }
}


const addEmployee = async(req,res)=>{ 
    try{
        const input = req.body;
        const emp = await EmployeeModel.create(input)

        
        // console.log(emp)
        res.status(200).send("Successfully added")
        const sent_from = process.env.EMAIL_USER 
        await sendMail(emp.EmployeeID,emp.EmployeeMailID,sent_from)
    }
    catch(e){
        console.log(e); 
        res.status(500).send("Internal Server Error"); 
    }
}

const viewEmployees = async (req, res) => {
    try {
        const response = await EmployeeModel.find({},{_id:0,EmployeePassword:0,EmployeeProfile:0,__v:0}).sort({EmployeeID:1});
        res.status(200).json(response);
    } catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    } 
}

const deleteEmployeeByID = async(req,res)=>{
    try{
        const empid = req.params.id;
        await EmployeeModel.findOneAndDelete({ EmployeeID: empid });
        await LeaveApplicationModel.deleteMany({ EmployeeID: empid});
        res.status(200).send("Deleted Succesfully");
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error.");
    }
}

const setStatus = async (req, res) => {
    try {
        const empid = req.params.ID;
        const employee = await EmployeeModel.findOne({ EmployeeID: empid });
        if (employee) {
            const newStatus = employee.EmployeeStatus === "Active" ? "Inactive" : "Active";
            await EmployeeModel.findOneAndUpdate({ EmployeeID: empid }, { $set: { EmployeeStatus: newStatus } });
            res.status(200).send(`Status set to ${newStatus}`);
        } else {
            res.status(404).send("Employee not found.");
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error.");
    }
}

const viewAppliedLeaves = async(req,res)=>{
    try{
        const leaves = await LeaveApplicationModel.find().sort({LeaveAppliedOn:-1})
        await res.json(leaves)
    }
    catch(e){
        console.log(e.message)
    }
}

const viewleaveHistoryByEID = async (req, res) => {
    try {
        const empid = req.params.id;
        const leaveData = await LeaveApplicationModel.find({ EmployeeID: empid }).sort({LeaveAppliedOn:-1});
        res.status(200).json(leaveData);
    } catch (e) {
        res.status(500).send(e.message);
        console.log(e.message);
    }
};

const approveLeave = async (req, res) => {
    const lid = req.params.id;
    try {
        const leave = await LeaveApplicationModel.findOne({ LeaveID: lid });
        if (!leave) {
            return res.status(404).json({ error: 'Leave not found' });
        }
        await LeaveApplicationModel.updateOne({ LeaveID: lid }, { $set: { LeaveStatus: "Approved" } });
        // console.log(leave);
        const emp = await EmployeeModel.findOne({EmployeeID: leave.EmployeeID})
        semail = process.env.EMAIL_USER
        await sendApproveMail(leave.EmployeeID,emp.EmployeeName,leave.LeaveID,leave.LeaveType,emp.EmployeeMailID,semail)
        return res.status(200).json({ message: 'Leave approved successfully' });
    } catch (error) {
        console.error('Error approving leave:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const rejectLeave = async(req,res)=>{
    const lid = req.params.id;
    try {
        const leave = await LeaveApplicationModel.findOne({ LeaveID: lid });
        if (!leave) {
            return res.status(404).json({ error: 'Leave not found' });
        }
        await LeaveApplicationModel.updateOne({ LeaveID: lid }, { $set: { LeaveStatus: "Rejected" } });
        console.log(leave);
        const emp = await EmployeeModel.findOne({EmployeeID: leave.EmployeeID})
        semail = process.env.EMAIL_USER
        await sendRejectMail(leave.EmployeeID,emp.EmployeeName,leave.LeaveID,leave.LeaveType,emp.EmployeeMailID,semail)
        return res.status(200).json({ message: 'Leave approved successfully' });
    } catch (error) {
        console.error('Error approving leave:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}


const deleteLeaveByID = async(req,res)=>{
    try{
        const empid = req.params.id
        await LeaveApplicationModel.findOneAndDelete({ LeaveID: empid })
        res.status(200).send("Deleted Succesfully")
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error.");
    }

}

const leaveAnalysis = async(req,res)=>{
    try{
        const EmployeeCount = await EmployeeModel.countDocuments();
        const LeaveCount = await LeaveApplicationModel.countDocuments();
        const LeavePendingCount = await LeaveApplicationModel.countDocuments({LeaveStatus: 'Pending'});
        const LeaveApprovedCount = await LeaveApplicationModel.countDocuments({LeaveStatus: 'Approved'});
        const LeaveRejectedCount = await LeaveApplicationModel.countDocuments({LeaveStatus: 'Rejected'});
        const CasualLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Casual Leave"})
        const SickLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Sick Leave"})
        const MaternityLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Maternity Leave"})
        const MedicalLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Medical Leave"})
        const CompensatedCasualLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Compensated Casual Leave"})
        const HalfPaidLeaveLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Half-Paid Leave"})
        const LeaveCountDayByDay = await LeaveApplicationModel.aggregate([
            {
                $addFields: {
                    ampmIndex: { $indexOfCP: ["$LeaveAppliedOn", " AM"] },
                    pmIndex: { $indexOfCP: ["$LeaveAppliedOn", " PM"] }
                }
            },
            {
                $addFields: {
                    dateString: {
                        $cond: {
                            if: { $ne: ["$ampmIndex", -1] },
                            then: { $substrCP: ["$LeaveAppliedOn", 0, "$ampmIndex"] },
                            else: {
                                $cond: {
                                    if: { $ne: ["$pmIndex", -1] },
                                    then: { $substrCP: ["$LeaveAppliedOn", 0, "$pmIndex"] },
                                    else: "$LeaveAppliedOn"
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    parsedDate: {
                        $dateFromString: {
                            dateString: "$dateString",
                            format: "%d-%m-%Y %H:%M:%S"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({EmployeeCount,LeaveCount,LeavePendingCount,LeaveApprovedCount,LeaveRejectedCount,CasualLeaveCount,MaternityLeaveCount,MedicalLeaveCount,HalfPaidLeaveLeaveCount,CompensatedCasualLeaveCount,SickLeaveCount,LeaveCountDayByDay})

    }
    catch(e){
        res.status(500).send(e.message)
    }
}
const fetchEmployeebyID = async(req,res)=>{
    try{
        const empid = req.params.ID
        const employee = await EmployeeModel.findOne({EmployeeID: empid})
        // console.log(employee)
        res.status(200).json(employee)
    }
    catch(e){
        res.status(500).send("Internal Server Error")
    }

}

const UpdateEmployeebyID = async(req,res)=>{
    try{
        const empid = req.params.ID
        const input = req.body
        const response = await EmployeeModel.updateOne({ EmployeeID: empid }, { $set: input });
        res.status(200).send("Employee Updated successfully!")
    }
    catch(e){
        res.status(500).send("Internal Server Error"+e.message) 
    }
}

const viewLeaveByLID = async(req,res)=>{
    const lid = req.params.ID;
    const leave = await LeaveApplicationModel.findOne({LeaveID:lid},{_id:0,__v:0})
    if(!leave){
        res.status(200).send("No leave record is found!")
        return
    }
    else{
        res.status(200).send(leave)
    }
}


const ChangePassword = async(req,res)=>{
    const { newpwd, oldpwd } = req.body;
    const uname = req.params.uname;
    try {
        const admin = await AdminModel.findOne({ username: uname, password: oldpwd });
        if (!admin) {
        return res.status(400).send("Incorrect Old Password");
        } else {
        if (newpwd === oldpwd) {
            return res.status(400).send("Current and New passwords are same!");
        } else {
            await AdminModel.updateOne({ username: uname }, { $set: { password: newpwd } });
            res.status(200).json("Password updated successfully!");
        }
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}


module.exports = { fetchEmployeebyID, checkAdminLogin,addEmployee,viewEmployees,deleteEmployeeByID,viewAppliedLeaves,approveLeave,rejectLeave,deleteLeaveByID,leaveAnalysis,setStatus,UpdateEmployeebyID,viewLeaveByLID,ChangePassword,viewleaveHistoryByEID };
