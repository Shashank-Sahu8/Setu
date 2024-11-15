const OtpVerification = require('../models/otp_verify');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken'); 
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const firebaseService = require('../services/services');
const { sendOtpEmail } = require('../services/emailService.js');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// const { Vonage } = require('@vonage/server-sdk')

// const vonage = new Vonage({
//   apiKey: "e3415a01",
//   apiSecret: "NTNZcg253IXqEPsc"
// })
const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const nameRegex = /^[a-zA-Z\s]{1,50}$/;

exports.login=async(req,res,next)=>{
    const { phone,aid } = req.body;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format.' });
    }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); 

  try {
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpEntry = await OtpVerification.findOneAndUpdate(
        { phone },
        { otp: hashedOtp,},
        { new: true, upsert: true }
    );

  //   const from = "Vonage APIs";
  //   const to =`+91${phone}`;
  //   const text = `Dear Customer, your OTP is ${otp}.`;

  //   async function sendSMS() {
  //     await vonage.sms.send({to, from, text })
  //         .then(resp => { console.log('Message sent successfully'); console.log(resp); })
  //         .catch(err => { 
  //           res.status(500).json({ message: 'Error sending OTP.' });
  //           console.log('There was an error sending the messages1.'); console.error(err); });
  //         }
  
  // sendSMS();

    await client.messages.create({
      body: `Your OTP is: # ${otp} ${aid}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

     res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error sending OTP.' });
  }
}



exports.emaillogin=async(req,res,next)=>{
    const { email } = req.body;
    console.log("valid");
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    console.log("valid");
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); 

  try {
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpEntry = await OtpVerification.findOneAndUpdate(
        { email },
        { otp: hashedOtp,},
        { new: true, upsert: true }
    );

    
    await sendOtpEmail(email, otp);
     res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error sending OTP.' });
  }
}


exports.verify=async(req,res,next)=>{
    const { email, otp } = req.body;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid phone number format.' });
    }

  try {
    const otpData = await OtpVerification.findOne({ email });
    if (!otpData) {
        return res.status(400).json({ message: 'OTP not found' });
    }

     if (Date.now() > otpData.createdAt + 5 * 60 * 1000) { 
            return res.status(400).json({ message: 'OTP expired' });
        }

    const isMatch = bcrypt.compareSync(otp,otpData.otp);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

    await OtpVerification.deleteOne({ email });

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
      await user.save();
    }
    else{
      const user = await User.findOneAndUpdate(
        { email },
        { first_time: false },
        { new: true });
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    const newRefreshToken = new RefreshToken({
      token: refreshToken,
      userId: user._id,
    });
    await newRefreshToken.save();
    res.status(200).json({ token, refreshToken,user });
  } catch (error) {
    res.status(500).json({ message: 'OTP verification failed', error });
  }
}


exports.verifyGoogleToken = async (req, res) => {
    console.log("requesting");
    const idToken = req.body.token;
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'No ID token provided',
      });
    }
    console.log(idToken);
    try {
      const decodedToken=await firebaseService.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;
        console.log("decoded");
  
        if (!uid || !email) {
          return res.status(400).json({
            success: false,
            message: 'Token does not contain required fields',
          });
        }
        console.log("proceeded");
        let user = await User.findOne({ uid });
        if (!user) {
            user = new User({ uid, email,emailverified:true,first_time:true });
            await user.save();
        }
        console.log("genrating token");
        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
        const newRefreshToken = new RefreshToken({
          token: refreshToken,
          userId: user._id,
        });
        await newRefreshToken.save();
        
  
        res.status(200).json({
            token,refreshToken,user
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
  };

  exports.refresh = async (req, res, next) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const newToken = jwt.sign(
            { id: decoded.id, phone: decoded.phone },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } 
        );

        const newRefreshToken = jwt.sign(
            { id: decoded.id, phone: decoded.phone },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );
        let etoken = await RefreshToken.findOne({ token });
        if(!etoken)
        {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }
        await RefreshToken.deleteOne({ token });
        const nRefreshToken = new RefreshToken({
          token: newRefreshToken,
          userId: etoken.userId,
        });
        await nRefreshToken.save();
        res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
}

exports.update_first_time= async(req,res,next)=>{
    const { phone, name, dob,email, region, language,uid } = req.body;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format.' });
    }
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: 'Invalid name format.' });
    }
  
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    
    try {
      let cuser = await User.findOne({ phone });
      let user=null;
      if(!cuser){
        let guser = await User.findOne({ uid });
        if(guser.uid=="")
        {
          return res.status(404).json({ message: 'User not found.' });
        }
        user = await User.findOneAndUpdate(
          { uid },
          { name, dob,email, region, language,phone, first_time: false },
          { new: true }
        );

      }
      else{

         user = await User.findOneAndUpdate(
          { phone },
          { name, dob,email, region, language, first_time: false },
          { new: true }
        );

      }
      if (!user)
        {
            return res.status(404).json({ message: 'User not found.' });
        }
      res.status(200).json({ message: 'User information updated successfully!',user});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error updating user information.' });
    }
}

exports.logout=async(req,res)=>{
    const token = req.body.token;
    try{
      console.log("j");
      await RefreshToken.deleteOne({ token });
      res.status(200).json({ message: 'Logged out successfully' });
    }catch(error)
    {
      res.status(400).json({ message: 'Failed to log out' });
    }
    
  }