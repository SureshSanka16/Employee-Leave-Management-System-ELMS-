const nodemailer = require('nodemailer');

const sendMail = async(empid,sent_to, sent_from )=>{
    console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "MISSING");


    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        PORT: "587",
        auth:{
            user:process.env.BREVO_USER,
            pass:process.env.EMAIL_PASS,
        },
        tls:{
            rejectUnauthorized:false,
        }


    })
    const options = {
  from: {
    name:"Employee Leave Management System",   // ✅ updated system name
    address: sent_from,
  },
  to: sent_to,
  subject: "Your Employee Account Details",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #007bff; text-align: center;">Welcome to Leave System</h2>
      <p style="text-align: center; color: #555;">Your account has been created successfully. Below are your login details:</p>
      
      <p><strong>Employee ID:</strong> <span style="color:#009688;">${empid}</span></p>
      <p><strong>Username:</strong> Your Employee ID</p>
      <p><strong>Password:</strong> Your Date of Birth (format: yyyy-mm-dd)</p>
      
      <p style="color: #d9534f; font-size: 0.9em; margin-top: 15px;">
        ⚠️ Please log in and change your password immediately for security.
      </p>
      
      <p style="margin-top: 20px; color: #555;">Regards,<br/>Leave System Team</p>
    </div>
  `,
};


    //Send Mail
    transporter.sendMail(options,function(err,info){
        if(err){
            console.log(err)
        }
        else{
            console.log("Email sent successfully");
        }
    })
}
module.exports = sendMail