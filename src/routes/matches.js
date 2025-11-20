//router
const express = require("express");
const matchRouter = express.Router();

//middleware
const userAuth = require("../middlewares/auth");

//model
const Match = require("../models/match");
const Connection = require("../models/connection");

//get all user matches

//get specific matches

//delete match
matchRouter.patch("/matches/unmatch/:matchId", userAuth, async (req, res) => {
  const matchId = req.params.matchId;
  const userId = req.user._id;

  try {
    //check  if match exist
    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const isValidUser = match.users.some((user) => user.equals(userId));
    if (!isValidUser) {
      return res
        .status(403)
        .json({ message: "You are not part of this match" });
    }
    await Match.findByIdAndUpdate(matchId, { status: "unmatched" });

    const [userA, userB] = match.users;
    console.log(userA, userB)

    await Connection.updateMany(
        {
            $or : [
                {fromUserId:userA, toUserId:userB},
                {fromUserId:userB, toUserId:userA}
            ]
        },
        {$set: {status:"unmatched"}}
     
    );
    return res.status(200).json("Successfully unmatched");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = matchRouter;
