const express = require('express');
const router = express.Router();
const UserController=require('../controllers/user.controller');
//public routs

router.post('/login',UserController.login);

router.post("/verify-otp",UserController.verify);

//private routs

module.exports=router;