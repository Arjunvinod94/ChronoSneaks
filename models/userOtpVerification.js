const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserOTPVerificationSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    otpExpiration: {
      type: Date,
      required: true,
    },
  });

const UserOTPVerification = mongoose.model(
    "UserOTPVerification",
    UserOTPVerificationSchema
)

module.exports = UserOTPVerification