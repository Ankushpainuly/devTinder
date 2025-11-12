const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

const userRouter = express.Router();

//Get all pending connection requests for logedInUser
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: logedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills"
    );

    // }).populate("fromUserId", ["firstName","lastName"]);

    res.json({
      message: "Data fetched Successfully!",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

//Get all connection that include logedInUser
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;

    //find all connection that include logedInUser as { toUserId or fromUserId } as well as status accepted
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: logedInUser._id, status: "accepted" },
        { fromUserId: logedInUser._id, status: "accepted" },
      ],
    })
      .populate("toUserId", USER_SAFE_DATA)
      .populate("fromUserId", USER_SAFE_DATA);

    //only include data of the other user that connected to logedInUser
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === logedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;

    const page = parseInt(req.query.page) || 1; //default page 1 ,limit 10
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit; //agar limit > 50 h to limit 50 krdo nito limit jitni h utni rakho

    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: logedInUser._id }, { toUserId: logedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set(); //using set data structure so not include duplicate id's

    //add all user id to set
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    //find all users who are not in hideUsers and not the logedInUser
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, //converting set into array ,and check //$nin not in array
        { _id: { $ne: logedInUser._id } }, //$ne not equal to
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
    
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

module.exports = userRouter;
