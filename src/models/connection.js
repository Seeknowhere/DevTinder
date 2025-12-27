const mongoose = require('mongoose');
const { Schema , model } = mongoose;

const connectionSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type:Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum : {
            values: ['like','pass','unmatched'],
            message:'{VALUE} not valid'
        },
        required:true
    }
}, {timestamps:true});

connectionSchema.index(
    { fromUserId:1, toUserId:1},
    {unique: true}
)
connectionSchema.pre("save", function(next){
    const connection = this;
    if(connection.fromUserId.equals(connection.toUserId)){
        throw new Error("You cannot send connection request to yourself")
    }
   next(); 

})

const Connection = new model('connectionrequest',connectionSchema)

module.exports= Connection;