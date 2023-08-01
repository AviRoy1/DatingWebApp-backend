import express from "express";
import joi from "joi";
import { getErrorMessage } from "../../utils/joi.util.js";
import verifytoken from "../../middlewares/verifyToken.js";
import {
  buySubscription,
  paymentVerification,
  getRazorpayKey,
  getNotification,
} from "../../controller/Subscription.js";

const router = express.Router();

const buysubSchema = joi.object().keys({
  plan: joi.string().required(),
});
router.post(
  "/subscribe",
  verifytoken,
  async (req, res, next) => {
    try {
      req.body = await buysubSchema.validateAsync(req.body);
      next();
    } catch (err) {
      return res.status(422).json({ message: getErrorMessage(err) });
    }
  },
  buySubscription
);

router.post("/paymentverification", verifytoken, paymentVerification);

router.get("/razorpaykey", getRazorpayKey);

router.post("/getnotification", getNotification);

export default router;
