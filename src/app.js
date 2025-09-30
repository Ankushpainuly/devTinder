//creating server using express js
const express=require('express');

const app=express();

//order matters


//this will only handle get calls to /user
app.get("/user",(req,res)=>{
    res.send({firstName:"Ankush", lastName:"Painuly"});
})

app.post("/user",(req,res)=>{
    res.send("data send sucessfully.");
});

app.delete("/user",(req,res)=>{
    res.send("data deleted sucessfully.");
});

//this will match all the HTTP methods APIs calls to /test
app.use("/test",(req,res)=>{
    res.send("This is the test page!");
});



app.listen(777,()=>{
    console.log("Server is sucessfully lisning on port 777...");
});