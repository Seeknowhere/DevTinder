const express = require("express");
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const Connection = require("../models/connection");
const userRouter = express.Router();

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    const skip = (page-1) * limit;

    limit = limit > 50 ? 50 : limit;



    //feed only users whom the user haven't swiped

    const users = await User.find({});

    const swipedConnections = await Connection.find({
      fromUserId: loggedInUserId,
      status: { $in: ["like", "pass"] },
    });

    const swipedUserIds = swipedConnections.map((c) => c.toUserId);

    if (!users || users === 0) {
      res.status(404).send("User not found");
    } else {
      const feedUsers = await User.find({
        _id: { $nin: [...swipedUserIds, loggedInUserId] },
      }).skip(skip).limit(limit);

      return res.status(200).json({
        message: "User feed fetched successfully",
        data: feedUsers,
      });
    }
  } catch (err) {
    console.error(err)
    return res.status(500).send("Something went wrong: " + err.message);
  }
});

module.exports = userRouter;
