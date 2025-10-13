//creating server using express js
const express = require("express");
const connectDB =require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());//It parses incoming requests with JSON 
app.use(cookieParser());//for reading cookies

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouteer = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouteer);
app.use("/",userRouter);

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


