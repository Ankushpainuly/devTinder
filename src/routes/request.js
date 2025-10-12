const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const authRouter = require("./auth");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //only these status allowed
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status type :" + status });
      }

      //toUser is not in our user Collection
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found!" });
      }

      //if there is a existing connectionRequest
      //here using mongo db {or }
      //ager person (a send to b) then cannot send again and (b cannot send to a)
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({ message: "Connection request Already existed!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection Request Send Successfully!",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR :" + err.message);
    }
  }
);


requestRouter.post(
  "/request/review/:status/:requestedId",
  userAuth,
  async (req, res) => {

    try {
      const logedInUser = req.user;
      const { status, requestedId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status no allowed! " + status });
      }
      
      //find the connectionRequest which has the id:reqId , toUserId:currUserId ,status : interested
      //so we can accept or reject the req
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestedId,
        toUserId: logedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Not Found!!" });
      }

      connectionRequest.status=status;

      const data = await connectionRequest.save();

      res.json({message:"Connection Request"+status,data});


    } catch (err) {
      res.status(400).send("ERROR :" + err.message);
    }
  }
);

module.exports = requestRouter;
