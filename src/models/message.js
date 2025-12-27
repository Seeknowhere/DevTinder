const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const messageSchema = new Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    targetUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true});

const Message = model('Message', messageSchema);
module.exports = Message;