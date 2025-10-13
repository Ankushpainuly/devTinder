const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

const userRouter = express.Router();

//Get all pending connection requests for logedInUser
userRouter.get("/user/requests/received",userAuth, async (req,res)=>{

    try{
        const logedInUser = req.user;
       
        const connectionRequests = await ConnectionRequest.find({
            toUserId:logedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills");

        // }).populate("fromUserId", ["firstName","lastName"]);
        

        res.json({message:"Data fetched Successfully!",data:connectionRequests});

    }catch(err){
        res.status(400).send("ERROR "+err.message);
    }
});

//Get all connection that include logedInUser
userRouter.get("/user/connections", userAuth ,async (req,res)=>{

    try{
        const logedInUser =req.user;
        

        //find all connection that include logedInUser as { toUserId or fromUserId } as well as status accepted
        const connectionRequest = await ConnectionRequest.find({
            $or :[
                {toUserId :logedInUser._id, status:"accepted"},
                {fromUserId :logedInUser._id, status:"accepted"}
            ],
            
        }).populate("toUserId" , USER_SAFE_DATA).populate("fromUserId",USER_SAFE_DATA);

        //only include data of the other user that connected to logedInUser
        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === logedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;

        });

        res.json({ data });

    }catch(err){
        res.status(400).send("ERROR "+err.message);
    }
});

module.exports = userRouter;

 