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


