const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    address:{
        type:String,
    },
    forgotPasswordToken: {
      type: String
    },
    forgotPasswordExpiryDate: {
      type: Date
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods = {
  jwtToken() {
    return jwt.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role
      },
      process.env.SECRET,
      { expiresIn: '96h' }
    );
  },
  getForgotPasswordToken() {
    const forgotToken = crypto.randomBytes(20).toString('hex');
    // Step 1 - save to DB
    this.forgotPasswordToken = crypto
      .createHash('sha256')
      .update(forgotToken)
      .digest('hex');

    // Forgot password expiry date
    this.forgotPasswordExpiryDate = Date.now() + 120 * 60 * 1000;

    // Step 2 - return values to user
    return forgotToken;
  }
};

// Ensure only one admin exists
userSchema.statics.ensureAdminExists = async function () {
  const adminCount = await this.countDocuments({ role: 'admin' });
  if (adminCount === 0) {
    // Create a default admin
    await this.create({
      name: 'Lakshay Bansal',
      email: 'lakshaybansal879@gmail.com',
      password: 'lb879',
      address:"Faridabad", 
      phone: '9205869712',
      role: 'admin'
    });
  }
};

module.exports = mongoose.model("User", userSchema);
