const express=require('express');
const cors=require('cors');
const UserRouter=require('./routs/user.routs');
const body_parser=require('body-parser');
const app=express();
const helmet=require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, 
    max: 100, 
    message: 'Bado Badi Bado Badi !!'
  });


app.use(limiter);
app.use(helmet());
app.use(body_parser.json());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use('/',UserRouter); 

module.exports=app;
