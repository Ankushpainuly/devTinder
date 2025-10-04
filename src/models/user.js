const mongoose =require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,

    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,

    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){//custom validator
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data in not valid");
            }
        },

    },
    phontoUrl:{
        type:String,
        default:"https://kristalle.com/wp-content/uploads/2020/07/dummy-profile-pic-1.jpg",
    },
    about:{
        type:String,
        default:"This is a default about of the user!",
    },
    skills:{
        type: [String],
    },
    

},{timestamps:true});

module.exports=mongoose.model("User",userSchema);//use 1 char as upercase in model name