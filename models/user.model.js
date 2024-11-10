const mongoose = require('mongoose');
const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const nameRegex = /^[a-zA-Z\s]{1,50}$/;

const userSchema = new mongoose.Schema({
  uid: 
  {  
    type: String,  
    default:null,  
  }, 
  phone:  
  { 
    type: String, 
    default:null, 
    required: false, 
    unique: false ,
    validate: {
      validator: function(v) {
        // Skip validation if the phone is null
        return v == null || phoneRegex.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  name: 
  { 
    type: String, 
    default: ""  ,
    validate: {
      validator: function(v) {
        // Allow empty string (optional name) or validate with regex
        return v === "" || nameRegex.test(v);
      },
      message: props => `${props.value} is not a valid name!`
    }
  },
  dob: 
  { 
    type: String, 
    default: ""  
  },
  email: 
  {
    type:String, 
    unique: false , 
    default:null ,
    validate: {
      validator: function(v) {
        // Allow null or validate with regex
        return v == null || emailRegex.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  emailverified: 
  {
    type:Boolean, 
    default:false 
  },
  region: 
  { 
    type: String, 
    default: ""  
  },
  language: 
  { 
    type: String, 
    default: "" 
  },
  first_time: 
  { 
    type: Boolean, 
    default: true 
  },
});

module.exports = mongoose.model('User', userSchema); 
