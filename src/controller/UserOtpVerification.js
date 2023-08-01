import userOtpVerification from "../model/UserOtpVerfication.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/SendMail.js";

export const sendOTPVerificationEmail = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete your registration.<p>`,
    };

    const salt = 10;

    const hashedOTP = await bcrypt.hash(otp, salt);

    const newOTPVerification = await new userOtpVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    const newOtp = await newOTPVerification.save();
    //console.log(newOtp);
    await sendMail(mailOptions);

    return {
      status: "PENDING",
      message: "verification email sent",
      data: {
        userId: _id,
        email,
      },
    };
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

export const VerifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      throw Error("Empty otp details are not allowes!");
    } else {
      const userRecords = await User.find({ userId });

      if (userRecords.length <= 0) {
        throw new Error(
          "Account Record doesn't exist or has been verified already."
        );
      } else {
        const { expiresAt } = userRecords[0];
        const hashedOTP = userRecords[0].otp;

        if (expiresAt < Date.now()) {
          await userOtpVerification.deleteMany({ userId });
          throw new Error("Code has expired. Please request again.");
        } else {
          const validOTP = bcrypt.compare(otp, hashedOTP);

          if (!validOTP) {
            throw new Error("Invalid code passed. Check your Inbox.");
          } else {
            await User.updateOne({ _id: userId }, { verfied: true });
            await userOtpVerification.deleteMany({ userId });

            return res.json({
              status: "VERIFIED",
              message: `User email has been verified Successfully`,
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};
