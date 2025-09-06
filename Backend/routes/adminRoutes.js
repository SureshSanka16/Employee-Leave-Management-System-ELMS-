const express = require('express')
const { checkAdminLogin,addEmployee,viewEmployees,
    deleteEmployeeByID,viewAppliedLeaves,approveLeave,
    rejectLeave,deleteLeaveByID,leaveAnalysis,setStatus,
    UpdateEmployeebyID,viewLeaveByLID,ChangePassword,
    viewleaveHistoryByEID ,fetchEmployeebyID}=require('../controllers/adminControllers');
    
const adminrouter = express.Router();

const { verifytoken, authorize } = require('../utils/Auth');

adminrouter.post('/checkadminlogin', checkAdminLogin)
adminrouter.post('/addEmployee', [verifytoken, authorize("admin"), addEmployee])
adminrouter.get('/viewEmployees', [verifytoken, authorize("admin"), viewEmployees])
adminrouter.delete('/deleteEmployee/:id', [verifytoken, authorize("admin"), deleteEmployeeByID])
adminrouter.get('/leavesapplied', [verifytoken, authorize("admin"), viewAppliedLeaves])
adminrouter.get('/viewLeavesbyeid/:id',[verifytoken, authorize("admin"),viewleaveHistoryByEID])
adminrouter.put('/approve/:id', [verifytoken, authorize("admin"), approveLeave])
adminrouter.put('/reject/:id', [verifytoken, authorize("admin"), rejectLeave])
adminrouter.delete('/deleteleaveByid/:id', [verifytoken, authorize("admin"), deleteLeaveByID])
adminrouter.get('/leaveAnalysis', [verifytoken, authorize("admin"), leaveAnalysis])
adminrouter.put('/changeStatus/:ID', [verifytoken, authorize("admin"), setStatus])
adminrouter.put('/updateEmployeebyID/:ID', [verifytoken, authorize("admin"), UpdateEmployeebyID])
adminrouter.get('/viewLeaveByLID/:ID', [verifytoken, authorize("admin"), viewLeaveByLID])
adminrouter.post('/changePassword/:uname', [verifytoken, authorize("admin"), ChangePassword])
adminrouter.get('/employeebyID/:ID', [verifytoken, authorize("admin"), fetchEmployeebyID])


module.exports = adminrouter;
