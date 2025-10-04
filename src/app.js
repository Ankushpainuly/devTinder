//creating server using express js
const express = require("express");
const connectDB =require("./config/database");
const User =require("./models/user");

const app = express();

app.use(express.json());//built in middleware for parsing json into js object

app.post("/signup",async (req,res)=>{

    //creating a new instance of user model
    const user =new User(req.body);

    try{
        await user.save();//now it insert the user in users collection if already exits oderwise create and save
        res.send("User Added Succesfully");
    }catch(err){
        res.status(400).send("Error saving the user "+err.message);
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


app.patch("/user",async(req,res)=>{
    const userId=req.body.userId;
    const data =req.body;

    try{
        const user=await User.findByIdAndUpdate(userId ,data, //the data will updata other info will be same and ignore exta info if any that are not in schema
            {returnDocument:"before"},{runValidators:true});//optional field
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
        app.listen(777, () => {
          console.log("Server is sucessfully lisning on port 777...");
        });
    })
    .catch((err)=>{
        console.log("Databse cannot be connected");
    })


