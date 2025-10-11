const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData,validateEditProfilePassword } = require("../utils/validation");
const validator =require("validator");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User does not exit");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request ");
    }

    const logedInUser = req.user; //curr user

    Object.keys(req.body).forEach((key) =>(logedInUser[key] = req.body[key]));

    await logedInUser.save(); //udate the user

    res.json({
      message: `${logedInUser.firstName}, your profile is updated successfuly`,
      data: logedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password",userAuth, async(req,res)=>{
    try{
        if(!validateEditProfilePassword(req)){
            throw new Error("invalid request");
        }

        const logedInUser =req.user;
        const {currentPassword,newPassword } = req.body;

        const isValidPassword =await logedInUser.validatePassword(currentPassword);
        if(!isValidPassword){
            throw new Error("Incorrect Current Password");
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Enter a strong Password");
        }   

        const newPasswordHash=await bcrypt.hash(newPassword, 10);
        console.log(logedInUser.password);

        logedInUser.password =newPasswordHash;
        logedInUser.save();

        res.send("password changed");

    }catch(err){
        res.status(400).send("ERROR :" + err.message); 
    }


})

module.exports = profileRouter;
