const express = require("express");
const Connection = require("../models/connection");
const Match = require("../models/match");
const User = require("../models/user");
const userAuth = require("../middlewares/auth");

const swipeRouter = express.Router();

swipeRouter.post("/swipe/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    //validate status
    const allowedStatus = ["like", "pass"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid swipe status" });
    }

    //check if user exist
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "User not found" });
    }

    //prevent sending connection to self
    if (fromUserId.equals(toUserId)) {
      return res.status(400).json({ message: "You cannot swipe yourself." });
    }

    //prevent duplicate connection
    const existingRequest = await Connection.findOne({ fromUserId, toUserId, $or: [{status:"like"},{status:"pass"}]});
    if (existingRequest) {
      return res.status(400).json({ message: "You already swiped this user" });
    }

    //if the user like and the other user also swipe like it will save as a match
    if (status === "like") {
      //check if the other user swipe like
      const reverseLike = await Connection.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
        status: "like",
      });


      if (reverseLike) {
        const match = await Match.create({ users: [fromUserId, toUserId] });
        await Connection.create({ fromUserId, toUserId, status });

        return res.status(200).json({ message: "It's a match!", match });
      }
    }

    const request = await Connection.create({ fromUserId, toUserId, status });
    return res.status(201).json({ message: "Swipe saved", request });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = swipeRouter;
