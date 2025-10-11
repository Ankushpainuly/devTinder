const express =require("express");
const {userAuth} = require("../middlewares/auth");

const requestRouter = express.Router();


requestRouter.use("/sendConnectionRequest",userAuth, async (req,res)=>{
    const user =req.user;

    res.send(user.firstName+" send the connection Request!!");
});


module.exports = requestRouter;