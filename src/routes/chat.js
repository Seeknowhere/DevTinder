const express = require('express');
const userAuth = require('../middlewares/auth');
const chatRouter = express.Router();
const Match = require('../models/match')
const Message = require('../models/message')
chatRouter.get("/chat/:targetUserId", userAuth, async(req,res) => {
    try{
        const {targetUserId} = req.params;
        const userId = req.user._id;

       const isMatch =  await Match.findOne({
            users: {$all:[userId, targetUserId]}
        })

        if(!isMatch){
            return res.status(403).json({message: "You are not matched with this user"})
        }
        const messages = await Message.find({
           $or: [
            {senderId:userId , targetUserId},
            {senderId:targetUserId, targetUserId:userId}
           ]
        }).sort({createdAt:1})

        res.json(messages);

    }catch(err){
        res.status(500).send("ERROR: " + err.message);
    }
})

chatRouter.post("/chat/send/:targetUserId", userAuth, async(req,res) =>{

    try{
    const {targetUserId} = req.params;
    const {text} = req.body;
    const userId = req.user._id;

    const newMessage = new Message({
        senderId:userId,
        targetUserId,
        text:text
        
    })
    await newMessage.save();
    res.json(newMessage);

    }catch(err){
        res.status(500).send("ERROR: " + err.message)
    }
 
})
module.exports = chatRouter;