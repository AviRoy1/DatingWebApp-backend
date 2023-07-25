import dotenv from "dotenv";
import User from "../model/User.js";
import { instance } from "../../server.js";
dotenv.config();

export const buySubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.isAdmin) {
      return res.status(400).json({ message: "Admin can't buy subscription" });
    }

    let plan_id;
    if (req.body.plan == "1") {
      plan_id = process.env.PLAN_ID1;
      user.subscription.plan = req.body.plan;
    }
    if (req.body.plan == "2") {
      plan_id = process.env.PLAN_ID2;
      user.subscription.plan = req.body.plan;
    }
    if (req.body.plan == "3") {
      plan_id = process.env.PLAN_ID3;
      user.subscription.plan = req.body.plan;
    }

    const subscription = await instance.subscriptions.create({
      plan_id,
      customer_notify: 1,
      total_count: 1,
    });

    user.subscription.id = subscription.id;

    user.subscription.status = "active";

    await user.save();
    // console.log(subscription);
    res.status(201).json({
      success: true,
      subscription: subscription,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const {
      razorpay_signature,
      razorpay_payment_id,
      razorpay_subscription_id,
    } = req.body;
    const user = await User.findById(req.user.id);
    const subscription_id = user.subscription.id;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
      .digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;

    if (!isAuthentic)
      return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

    // database comes here
    await Payment.create({
      razorpay_signature,
      razorpay_payment_id,
      razorpay_subscription_id,
    });

    user.subscription.status = "active";

    await user.save();

    res.redirect(
      `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
  }
};

export const getRazorpayKey = async (req, res) => {
  return res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_API_KEY,
  });
};
