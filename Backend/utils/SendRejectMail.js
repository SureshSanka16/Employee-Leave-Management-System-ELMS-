const nodemailer = require('nodemailer');

const sendRejectMail = async (empid, empname, LeaveID, leavetype, sent_to, sent_from) => {
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
    name: "Employee Leave Management System",
    address: sent_from,
  },
  to: sent_to,
  subject: "Leave Application Rejected",
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Leave Application Status</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #d9534f;
          text-align: center;
        }
        p {
          font-size: 15px;
          line-height: 1.6;
          text-align: center;
        }
        .note {
          margin-top: 15px;
          font-size: 0.9em;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Leave Application Status</h1>
        <p>Hello <b>${empname}</b>,</p>
        <p>Your leave application (ID: <b>${LeaveID}</b>) for <b>${leavetype}</b> has been <b>rejected</b>.</p>
        <p>For more information, please contact your Administrator.</p>
        <p>Thank you for your understanding.</p>
        <p class="note">Regards,<br>Leave System</p>
      </div>
    </body>
    </html>
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

module.exports = sendRejectMail;
