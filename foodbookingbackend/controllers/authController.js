
const User =require('../models/userModel.js');
const emailValidator = require("email-validator");
const jwt=require('jsonwebtoken');

const crypto = require("crypto");

const bcrypt=require('bcrypt');
const { log } = require('console');
exports.signup = async (req, res) => {
  try {
      const { name, email, password, phone, address } = req.body;
      if (!name || !email || !password || !phone || !address) {
          throw new Error("All fields are required");
      }

      const validateEmail = emailValidator.validate(email);

      if (!validateEmail) {
          throw new Error("Please enter a valid email address");
      }

     
      const adminCount = await User.countDocuments({ role: 'admin' });

      let user;

      if (adminCount === 0) {
          // If no admin exists, create an admin
          user = await User.create({
              name,
              email,
              password,
              phone,
              address,
              role: 'admin',  // Set the role as 'admin'
          });
      } else {
          // If admin(s) exist, create a regular user
          user = await User.create({
              name,
              email,
              password,
              phone,
              address,
              role: 'user',  // Set the role as 'user'
          });
      }

      res.status(201).json({
          success: true,
          message: "User signup successfully",
          data: { user }
      });
  } catch (error) {
      if (error.code === 11000) {
          res.status(400).json({
              success: false,
              message: 'User already registered with this email',
          });
      } else {
          console.log(error);
          res.status(400).json({
              success: false,
              message: error.message,
          });
      }
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ userId: user._id,name: user.name  }, process.env.SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      token,
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already registered with this email',
      });
    } else {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

    exports.getuser = async (req, res) => {
        try {
          const user = await User.findOne({ _id: req.body.userId });
          return res.status(200).send({
            success: true,
            message: "User Fetched Successfully",
            user,
          });
        } catch (error) {
          console.log(error);
          return res.status(500).send({
            success: false,
            message: "unable to get current user",
            error,
          });
        }
    };
    const JWT = require("jsonwebtoken");

    exports.userLogout = (req, res, next) => {
      try {
        const cookieOptions = {
          expires: new Date(0), 
          httpOnly: true,
        };
    
        res.cookie("token", null, cookieOptions);
        
        res.status(200).json({
          success: true,
          message: "User logged out successfully",
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    };
    exports.forgotPassword = async (req, res, next) => {
        const email = req.body.email;
      
        // return response with error message If email is undefined
        if (!email) {
          return res.status(400).json({
            success: false,
            message: "Email is required"
          });
        }
      
        try {
          // retrieve user using given email.
          const user = await User.findOne({
            email
          });
      
          // return response with error message user not found
          if (!user) {
            return res.status(400).json({
              success: false,
              message: "User not found"
            });
          }
      
          // Generate the token with userSchema method getForgotPasswordToken().
          const forgotPasswordToken = user.getForgotPasswordToken();
      
          await user.save();
      
          return res.status(200).json({
            success: true,
            token: forgotPasswordToken
          });
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
      };
      
      exports.resetPassword = async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;
      
        // Log incoming data for debugging
        console.log('Token:', token);
        console.log('New Password:', password);
      
        // Return error message if password is missing
        if (!password) {
          return res.status(400).json({
            success: false,
            message: "New password is required"
          });
        }
      
        const hashToken = crypto.createHash("sha256").update(token).digest("hex");
      
        try {
          // Find the user using the hashed token and check the expiration date
          const user = await User.findOne({
            forgotPasswordToken: hashToken,
            forgotPasswordExpiryDate: {
              $gt: new Date() // forgotPasswordExpiryDate() less than the current date
            }
          });
      
          // Return the message if user not found
          if (!user) {
            return res.status(400).json({
              success: false,
              message: "Invalid Token or token is expired"
            });
          }
      
          // Update the user's password and save to the database
          user.password = password;
          await user.save();
      
          // Log success message and send the response
          console.log('Password successfully reset for user:', user.email);
          return res.status(200).json({
            success: true,
            message: "Successfully reset the password"
          });
        } catch (error) {
          // Log the error and send an error response
          console.error('Error resetting password:', error);
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
      };
      