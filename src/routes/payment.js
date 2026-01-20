const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmout } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: membershipAmout[membershipType] * 100,
      receipt: "BILL13375649",
      currency: "INR",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    //save it in db

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    //Retun back my order details to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    console.log("Webhook Called");
    const webhookSignature = req.headers("x-razorpay-signature");
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if(!isWebhookValid){
        return res.status(400).json({ msg: "Webhook Signature is invalid!" });
    }

    console.log("Valid Webhook Signature");

    //update my payment status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({orderId: paymentDetails.order_id});
    payment.status=paymentDetails.status;
    await payment.save();

    //make user premium
    const user = await User.findOne({_id: payment.userId});
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;

    await user.save();
    
    // if(req.body.event == "payment.captured"){
    // }

    // if(req.body.event == "payment.failed"){
    // }

    //return success response to razorpay
    return res.status(200).json({ msg: "Webhook recieve successfully" });

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.get("/premium/verify",userAuth , (req,res)=>{
    const user = req.user;
 
    if(user.isPremium){
        return res.json({isPremium: true});
    }

    return res.json({isPremium:false});
});

module.exports = paymentRouter;
