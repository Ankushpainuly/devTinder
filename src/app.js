//creating server using express js
const express = require("express");
const connectDB =require("./config/database");
const User =require("./models/user");
const {validateSignUpData} =require("./utils/validation");
const bcrypt =require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
        const isPasswordValid= await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            throw new Error("Invalid crendential!")
        }else{

            const token = await jwt.sign({ _id: user._id },"Infinity@1729");//hiding id inside the token with secretkey
           

            res.cookie("token",token);//add token in cookies and send response back
            res.send("Login succesfully!");        
        }

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
});


app.get("/profile",async (req,res)=>{

    try{
        const cookie =req.cookies;

        
        const { token }=cookie;
        //validate my token
        if(!token){
            throw new Error("Invalid Tokken");
        }
        
        const decodedMessage= await jwt.verify(token, 'Infinity@1729');
        console.log(decodedMessage);

        const {_id}=decodedMessage;
        const user=await User.findById(_id);
        if(!user){
            throw new Error("User does not exit");
        }

        
        res.send(user);
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

//Get user by emailId
app.get("/user",async (req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const user= await User.find({emailId:userEmail});
        if(!user){
            res.status(500).send("Something went wrong!!");
        }else{

            res.send(user);
        }
    }catch(err){
        res.status(500).send("Something went wrong!!");
    }

});


//feed Api => Get feed all users from database
app.get("/feed",async (req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);
    }catch(err){
        res.status(500).send("Something went wrong!!");
    }


});

app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;

    try{
       const user= await User.findByIdAndDelete({ _id: userId });;
    //    const user= await User.findByIdAndDelete(userId);;
        res.send("User deleted Successfully");

    }catch(err){
        res.status(500).send("Something went wrong!!");
    }
});


app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data =req.body;

    
    try{
        //API validation
        const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills"];
    
        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
        );
    
        if(!isUpdateAllowed){
            throw new Error("Update Not Allowed");
        }
        if(data?.skills.length>10){
            throw new Error("Update Not Allowed");
        }


        const user=await User.findByIdAndUpdate(userId ,data, //the data will updata other info will be same and ignore exta info if any that are not in schema
            {returnDocument:"before"},{runValidators:true});//optional field //1. returnDocument before update 2.schemaValidation in update allow
        console.log(user);
        res.send("User updated succesfully");

    }catch(err){
        res.status(500).send("Failed:"+err.message);
    }
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


