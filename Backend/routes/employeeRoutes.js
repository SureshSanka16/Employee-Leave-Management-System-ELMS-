  const express =  require('express')
  const {
    checkemployeelogin,
    empProfile,   
    applyLeave,
    sendotpmail,
    verifyotp,
    viewleaveHistory,
    ChangePassword,
    viewLeaveByLID,
    leaveAnalysis,
  }=require('../controllers/employeeControllers');
  const employeeRouter = express.Router()

  const { verifytoken, authorize } = require('../utils/Auth');

  employeeRouter.post('/checkemplogin', checkemployeelogin)
  employeeRouter.post('/sendotp/:ID',  sendotpmail)
  employeeRouter.post('/verifyotp/:ID', verifyotp)
  employeeRouter.get('/employeeprofile/:id', verifytoken, authorize('employee'), empProfile)
  employeeRouter.post('/applyleave/:ID', verifytoken, authorize('employee'), applyLeave)
  employeeRouter.get('/viewleavehistory/:id', verifytoken, authorize('employee'), viewleaveHistory)
  employeeRouter.post('/ChangePassword/:ID', verifytoken, authorize('employee'), ChangePassword)
  employeeRouter.get('/viewLeaveByLID/:ID/:LID',verifytoken, authorize('employee'),viewLeaveByLID)
  employeeRouter.get('/leaveanalysis/:id',verifytoken, authorize('employee'), leaveAnalysis)


  module.exports = employeeRouter
