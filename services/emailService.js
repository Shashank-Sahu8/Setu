const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL,   // Add your email here (e.g., 'your-email@gmail.com')
    pass: process.env.EMAIL_PASSWORD, // Add your email password or app-specific password here
  },
});


const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,  
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOtpEmail };
