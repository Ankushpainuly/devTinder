const mongoose =require("mongoose");
const validator =require("validator");//npm library
const { default: isURL } = require("validator/lib/isURL");


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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address: "+value);
            }
        },

    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password: "+value);
            }
        }
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
        validate(value){
            if(!isURL(value)){
                throw new Error("Invalid Photo URL: "+value);
            }
        }
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