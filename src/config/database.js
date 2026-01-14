const mongoose = require("mongoose");

//connecting to database "connecting string.net/"+"database name"

const connectDB=async ()=>{
    
    await mongoose.connect(
      process.env.DB_CONNECTION_SECRET
    );
}

module.exports=connectDB;


