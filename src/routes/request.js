const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userAuth = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["like", "pass"];

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status is not valid" });
      }
      const reverseRequest = await ConnectionRequest.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
      });

      if (reverseRequest) {
        if (reverseRequest.status === "like" && status == "like") {
          reverseRequest.status = "matched";
          await reverseRequest.save();
          return res.status(200).json({ message: "It's a match!" });
        } else {
          return res.status(400).json({ message: "A request already exists" });
        }
      }
      const existingRequest = await ConnectionRequest.findOne({
        toUserId,
        fromUserId,
      });

      if (existingRequest) {
        return res
          .status(400)
          .send({ message: "You already sent a request to this user." });
      }

      const request = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await request.save();
      
      return res
        .status(201)
        .json({ message: "Connection Request sent successfully", data });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
