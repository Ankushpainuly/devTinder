//creating server using express js
const express = require("express");

const app = express();

//we can have multiple route handlers
// app.get("/user",rh1,[rh2,rh3],rh4,rh5);//can also rap all or some of them inside a arry still works same

//can only send 1 res.send
app.get(
  "/user",
  (req, res, next) => {
    console.log("handling 1st route");
    // res.send("1st Response");
    next();
  },
  (req, res, next) => {
    console.log("handling 2nd route");
    // res.send("2nd Response");
    next();
  },
  (req, res, next) => {
    console.log("handling 3rd route");
    // res.send("3rd Response");
    next();
  },
  (req, res, next) => {
    console.log("handling 4th route");
    // res.send("4th Response");
    next();
  },
  (req, res, next) => {
    console.log("handling 5th route");
    res.send("5th Response");
  }
);


app.listen(777, () => {
  console.log("Server is sucessfully lisning on port 777...");
});
