const nodemailer = require('nodemailer');

const sendMail = async(rotp,sent_to, sent_from, reply_to)=>{
    const otp = rotp
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
    name:"Employee Leave Management System",
    address: sent_from,
  },
  to: sent_to,
  replyTo: reply_to,
  subject: "Your OTP Code - Leave System",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
      <h2 style="color: #007bff;">Your One-Time Password</h2>
      <p style="font-size: 20px; font-weight: bold; margin: 15px 0;">${otp}</p>
      <p style="color: #555;">This OTP will expire in <strong>2 minutes</strong>.</p>
      <p style="margin-top: 20px; font-size: 0.9em; color: #777;">If you didn’t request this OTP, please ignore this email.</p>
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