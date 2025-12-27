//router
const express = require("express");
const matchRouter = express.Router();

//middleware
const userAuth = require("../middlewares/auth");

//model
const Match = require("../models/match");
const Connection = require("../models/connection");

//get all user matches
matchRouter.get("/matches", userAuth, async (req, res) => {
  const loggedInUserId = req.user._id;
 
  try {
    const matches = await Match.find({
      users: loggedInUserId,
      status: "matched",
    }).populate("users", ["_id","firstName", "lastName", "photoUrl", "age" ,"gender", "about" ,"skills"]);

    if (!matches || matches.length === 0) {
      return res.json({ message: "No matches found" });
    }

    const matchedUsers = matches.map(match => {
      return match.users.find(
        user => user._id.toString() !== loggedInUserId.toString()
      );
    });

    return res
      .status(200)
      .json({ message: "Data fetched successfully", data: matchedUsers });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//get specific matches

//update to unmatch
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
    console.log(userA, userB);

    await Connection.updateMany(
      {
        $or: [
          { fromUserId: userA, toUserId: userB },
          { fromUserId: userB, toUserId: userA },
        ],
      },
      { $set: { status: "unmatched" } }
    );
    return res.status(200).json("Successfully unmatched");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


module.exports = matchRouter;
