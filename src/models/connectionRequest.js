const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        require : true
    },
    toUserId:{
        type : mongoose.Schema.Types.ObjectId,
        require : true

    },
    status:{
        type: String,
        require : true,
        enum : {
            values : ["interested","ignore","accepted","rejected"],
            message : `{VALUE} is incorrect status type`
        }
    }

},{
    timestamps : true
});

//using compound index to increse efficency for search 
connectionRequestSchema.index({fromUserId: 1,toUserId : 1});

//this middleware will run before every saving a document in connectionRequest collection
// do not use arrow function in this as well
connectionRequestSchema.pre("save", function(next){
    const connectionRequest =this;
    //check if fromUserId is equals to toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot Send connection request to yourself");
    }

    next();
});

const ConnectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequestModel;