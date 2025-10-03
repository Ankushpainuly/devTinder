const mongoose = require("mongoose");

//connecting to database "connecting string.net/"+"database name"

const connectDB=async ()=>{
    
    await mongoose.connect(
      "mongodb+srv://Ankush:AEN6RdSDndFziziX@namastenode.iy5txpf.mongodb.net/devTinder"
    );
}

module.exports=connectDB;


