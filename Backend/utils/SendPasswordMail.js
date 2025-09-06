const nodemailer = require('nodemailer');
const moment = require('moment');
const sendPasswordMail = async (empid,empname,sent_to) => {
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
    name:"Employee Leave Management System",
    address: process.env.EMAIL_USER,
  },
  to: sent_to,
  subject: "Password Changed Successfully",
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed</title>
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
        }
        .time {
          font-weight: bold;
          color: #007bff;
        }
        .note {
          margin-top: 15px;
          font-size: 0.9em;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Password Changed</h1>
        <p>Hello <b>${empname}</b>,</p>
        <p>Your <b>Leave Management Portal</b> account (UserID: <b>${empid}</b>) password was changed at:</p>
        <p class="time">${moment().tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm:ss A')}</p>
        <p>If this wasn’t you, please reset your password immediately or contact the admin.</p>
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

module.exports = sendPasswordMail;
