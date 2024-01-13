const express = require("express");
const authRouter = express.Router();
const cookieParser = require('cookie-parser');
const JWT=require('jsonwebtoken');
const crypto=require('crypto')
const jwtAuth = require('../midddleware/jwtAuth.js'); 
const{
  signup,
  signin,
  getuser,
  userLogout,
  forgotPassword,
  resetPassword
} = require("../controllers/authController.js");

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/getuser',jwtAuth,getuser);
authRouter.get('/logout', jwtAuth, userLogout);
authRouter.post('/forgotpassword', forgotPassword);
authRouter.post('/resetpassword/:token', resetPassword);


module.exports = authRouter;
