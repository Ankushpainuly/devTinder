const express =require("express");
const {validateSignUpData} =require("../utils/validation");
const bcrypt =require("bcrypt");
const User =require("../models/user");

const authRouter =express.Router();

authRouter.post("/signup",async (req,res)=>{

    
    try{
        //validation of data
        validateSignUpData(req);

        const {firstName,lastName,emailId,password}=req.body;
        
        //Encrypt password
        const passwordHash=await bcrypt.hash(password, 10);

        //creating a new instance of user model
        const user =new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        });


        await user.save();//now it insert the user in users collection if already exits oderwise create and save
        res.send("User Added Succesfully");
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }

});

authRouter.post("/login",async (req,res)=>{
    try{
        const {emailId,password}=req.body;

        //first check if emailId exist or not in db
        const user=await User.findOne({emailId:emailId});

        if(!user){
            throw new Error("Invalid Credential!");
        }

        //check password valid or not with the password and hashpassword from db
        const isPasswordValid= await user.validatePassword(password);

        if(!isPasswordValid){
            throw new Error("Invalid crendential!")
        }else{
            //create a JWT token
            const token = await user.getJWT();
           

            res.cookie("token",token,{expires: new Date(Date.now() + 8 * 3600000)});//add token in cookies and send response back // cookie will be removed after 8 hours
            res.send("Login succesfully!");        
        }

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

authRouter.post("/logout",async (req,res)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now())
    });

    res.send("Logout successfull !");
});

module.exports = authRouter;