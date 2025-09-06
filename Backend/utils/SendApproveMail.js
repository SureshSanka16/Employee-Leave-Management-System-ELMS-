const nodemailer = require('nodemailer');

const sendApproveMail = async (empid, empname, LeaveID, leavetype, sent_to, sent_from) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: "587",
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        }
    });

    const options = {
  from: {
    name: "Employee Leave Management System",   // ✅ your system name
    address: sent_from,
  },
  to: sent_to,
  subject: "Leave Application Status",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #007bff; text-align: center;">Leave Application Status</h2>
      <p>Hello <strong>${empname}</strong>,</p>
      <p>Your leave request <strong>(ID: ${LeaveID})</strong> for <strong>${leavetype}</strong> has been 
      <span style="color: green; font-weight: bold;">approved</span>.</p>
      <p>Thank you for using the Leave System.</p>
      <br/>
      <p style="color: #555;">Regards,<br/>Leave System Team</p>
    </div>
  `,
};


    // Send Mail
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent successfully");
        }
    });
};

module.exports = sendApproveMail;
