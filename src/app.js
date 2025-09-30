//creating server using express js
const express=require('express');

const app=express();


app.use("/contact",(req,res)=>{
    res.send("This is the contact page!");
});

app.use("/",(req,res)=>{
    res.send("Home page!!");
});

app.listen(777,()=>{
    console.log("Server is sucessfully lisning on port 777...");
});