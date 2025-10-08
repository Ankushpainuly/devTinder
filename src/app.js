//creating server using express js
const express = require("express");
const connectDB =require("./config/database");
const User =require("./models/user");
const {validateSignUpData} =require("./utils/validation");
const bcrypt =require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

const app = express();

app.use(express.json());//It parses incoming requests with JSON 
app.use(cookieParser());//for reading cookies

app.post("/signup",async (req,res)=>{

    
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

app.post("/login",async (req,res)=>{
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


app.get("/profile",userAuth,async (req,res)=>{

    try{
        
        const user=req.user;
        

        if(!user){
            throw new Error("User does not exit");
        }

        
        res.send(user);
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});


app.post("/sendConnectionRequest",userAuth, async (req,res)=>{
    const user =req.user;

    res.send(user.firstName+" send the connection Request!!");
})




//this function return a promise
connectDB()
    .then(()=>{
        console.log("Database connection establish..");

        //when the connection establish then we start lisning the server
        app.listen(300, () => {
          console.log("Server is sucessfully lisning on port 300...");
        });
    })
    .catch((err)=>{
        console.log("Databse cannot be connected");
    })


