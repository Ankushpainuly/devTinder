const validator=require("validator");

const validateSignUpData =(req)=>{
    const {firstName,lastName,emailId,password}=req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid!");
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid!");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a Strong Password");
    }
}

const validateEditProfileData = (req)=>{
    const allowedUpdates =["firstName","lastName","emailId","photoUrl","gender","age","about","skills"];

    const isEditAllowed = Object.keys(req.body).every(field => allowedUpdates.includes(field));

    return isEditAllowed;
}


const validateEditProfilePassword =(req)=>{
    const allowedUpdates =["currentPassword","newPassword"];

    const isEditAllowed = Object.keys(req.body).every(field => allowedUpdates.includes(field));

    return isEditAllowed;

}

module.exports ={
    validateSignUpData,
    validateEditProfileData,
    validateEditProfilePassword
}