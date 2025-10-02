//creating server using express js
const express = require("express");
const {adminAuth,userAuth} =require("./middlewares/auth");

const app = express();

//use of maiddleware so auth only check when go to /admin/**** or /user/data
app.use("/admin",adminAuth);

app.post("/user/login",(req,res)=>{
    res.send("user loged in successfully");
})
 
app.get("/user/data",userAuth,(req,res)=>{
    res.send("User Data Sent");
})

app.get("/admin/getData",(req,res)=>{
    res.send("AllData");
});

app.get("/admin/deleteUser",(req,res)=>{
    res.send("User Deleted");
})




app.listen(777, () => {
  console.log("Server is sucessfully lisning on port 777...");
});
