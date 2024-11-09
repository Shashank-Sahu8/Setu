const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema({
  phone: 
{ 
    type: String, 
    required: true, 
    unique: true 
},
  otp: 
{
     type: String, 
     required: true 
},
  createdAt: 
{ 
    type: Date, 
    default: Date.now, 
    expires: '5m' 
}
});

module.exports = mongoose.model('OtpVerification', otpVerificationSchema);