const mongoose =require("mongoose");
const validator =require("validator");//npm library
const { default: isURL } = require("validator/lib/isURL");
const jwt = require("jsonwebtoken");
const bcrypt =require("bcrypt");

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
        enum: {
            values : ["male","female","others"],
            message : `{VALUE} is not a gender type`
        },

        // validate(value){//custom validator
        //     if(!["male","female","others"].includes(value)){
        //         throw new Error("Gender data in not valid");
        //     }
        // },

    },
    isPremium:{
        type: Boolean,
        default: false,
    },
    membershipType:{
        type: String,
    },
    photoUrl:{
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


//schema method
userSchema.methods.getJWT = async function(){//don't use arrow function they cannot user "this" keyword
    const user =this;

    const token =await jwt.sign({ _id: user._id }, process.env.JWT_SECRET ,{expiresIn:"7d"});//hiding id inside the token with secretkey //ading expire of a token
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user =this;
    const passwordHash =user.password;

    const isPasswordValid =await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}


module.exports=mongoose.model("User",userSchema);//use 1 char as upercase in model name