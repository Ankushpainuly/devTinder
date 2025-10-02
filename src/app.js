//creating server using express js
const express = require("express");
const {adminAuth,userAuth} =require("./middlewares/auth");

const app = express();

//best practice is to use try{}catch{ } for error
app.get("/getUserData",(req,res)=>{
    //logic of dB call and get user data

    // try{

        throw new Error("errrrar");
        res.send("User Data sent");

    // }catch(err){
    //     res.status(500).send("some error occured");
    // }
})


//if 2 argument the 1.req,2.res 
//if 3 argument the 1.req,2.res,3.next
//if 4 argument the 1.err,2.req,3.res,4.next
app.use("/",(err,req,res,next)=>{//wild card error handling write at the end so if there if error that was not handled will handle here
    if(err){
        res.status(500).send("something went wrong");
    }
    
});


app.listen(777, () => {
  console.log("Server is sucessfully lisning on port 777...");
});
