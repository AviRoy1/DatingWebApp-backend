import mongoose, { Schema } from "mongoose";

const userOtpVerificationSchema = new Schema({
  userId: {
    type: String,
  },
  otp: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
});

const userOtpVerification = mongoose.model(
  "userOtpVerification",
  userOtpVerificationSchema
);

export default userOtpVerification;
