const jwt =require("jsonwebtoken");
const User =require("../models/user");

const userAuth =async (req,res,next)=>{

    try{
        const cookie =req.cookies;

        
        const { token }=cookie;
        //validate my token
        if(!token){
            throw new Error("Invalid Tokken");
        }
        
        const decodedObj= await jwt.verify(token, 'Infinity@1729');
        
        const {_id}=decodedObj;
        const user=await User.findById(_id);
        if(!user){
            throw new Error("User does not exit");
        }

        req.user =user;//attach user obj in reqObj
        next();
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
}

module.exports ={userAuth};