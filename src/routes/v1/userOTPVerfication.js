import express from "express";
import { VerifyOTP } from "../../controller/UserOtpVerification.js";

const router = express.Router();

router.post("/verifyotp", VerifyOTP);
export default router;
