const express = require('express');
const router = express.Router();
const UserController=require('../controllers/user.controller');
const verifyToken = require('../middleware/verifyToken');


//public routs

router.post('/login',UserController.login);

router.post("/verify-otp",UserController.verify);

router.post('/google-login', UserController.verifyGoogleToken);

router.post("/refresh",UserController.refresh);


//private routs

router.post("/update-info-first",verifyToken,UserController.update_first_time);


module.exports=router;