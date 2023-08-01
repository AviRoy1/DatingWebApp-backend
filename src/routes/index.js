import express from "express";
import userApis from "./v1/User.js";
import userActivity from "./v1/UserActivity.js";
import reportUser from "./v1/Report.js";
import subscribe from "./v1/Subscription.js";
import match from "./v1/Match.js";
import messageApi from "./v1/Message.js";
import ChatRoute from "./v1/Chat.js";
import NewsLetter from "./v1/NewsLetter.js";
import userOTPVerfication from "./v1/userOTPVerfication.js";

const router = express.Router();

router.use("/user", userApis);
router.use("/useractivity", userActivity);
router.use("/report", reportUser);
router.use("/payment", subscribe);
router.use("/match", match);
router.use("/message", messageApi);
router.use("/chat", ChatRoute);
router.use("/newsletter", NewsLetter);
router.use("/otp", userOTPVerfication);

export default router;
