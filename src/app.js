//creating server using express js
const express = require("express");
const connectDB =require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require('dotenv').config();


const app = express();

require("./utils/cronJob");

// middleware for cors
app.use(cors({
    origin:"http://localhost:5173",//fThis tells your backend to only accept requests coming from your frontend
    credentials:true,//This allows your frontend to send and receive cookies //If credentials: true is used on the backend, your frontend requests must include credentials too:
}));

app.use(express.json());//It parses incoming requests with JSON middleware
app.use(cookieParser());//for reading cookies middleware

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouteer = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouteer);
app.use("/",userRouter);
app.use("/",paymentRouter);
app.use("/",chatRouter);

const http = require("http");
const initializeSocket = require("./utils/socket");

const server = http.createServer(app);
initializeSocket(server);

//this function return a promise
connectDB()
    .then(()=>{
        console.log("Database connection establish..");

        //when the connection establish then we start lisning the server
        server.listen(process.env.PORT, () => {
          console.log("Server is sucessfully lisning on port 7777...");
        });
    })
    .catch((err)=>{
        console.log("Databse cannot be connected");
    })


