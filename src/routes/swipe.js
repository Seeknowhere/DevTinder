const express = require("express");
const Connection = require("../models/connection");
const Match = require("../models/match");
const User = require("../models/user");
const userAuth = require("../middlewares/auth");
const mongoose = require('mongoose');

const swipeRouter = express.Router();

swipeRouter.post("/swipe/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    //validate status
    if (!["like", "pass"].includes(status)) {
      return res.status(400).json({ message: "Invalid swipe status" });
    }

    //prevent self-swipe
    if (fromUserId.equals(toUserId)) {
      return res.status(400).json({ message: "You cannot swipe yourself." });
    }

    //check target user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const connection = await Connection.findOneAndUpdate(
      { fromUserId, toUserId },
      { status }, 
      { new: true, upsert: true }
    );

    if (status === "like") {
      const reverseLike = await Connection.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
        status: "like",
      });
      
      if (reverseLike) {
        const existingMatch = await Match.findOne({
          users: { $all: [fromUserId, toUserId] },
        });
       
        if (existingMatch) {
          return res
            .status(200)
            .json({ message: "Already matched!", existingMatch });
        }
        const newMatch = await Match.create({
          users: [fromUserId, toUserId],
          status: "matched",
        });
        
        return res.status(200).json({
          message: "Its a match!",
          isMatch: true,
          newMatch,
        });
      }
    }
    return res.status(201).json({ message: "Swipe saved", connection });

  
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = swipeRouter;
