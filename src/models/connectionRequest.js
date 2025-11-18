const mongoose = require('mongoose');
const { Schema , model } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type:Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum : {
            values: ['like','pass','matched','rejected'],
            message:'{VALUE} not valid'
        },
        required:true
    }
}, {timestamps:true});

connectionRequestSchema.index(
    { fromUserId:1, toUserId:1},
    {unique: true}
)
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send connection request to yourself")
    }
   next(); 

})

const ConnectionRequest = new model('connectionrequest',connectionRequestSchema)

module.exports= ConnectionRequest;