const express = require("express");
const authRouter = express.Router();

const { validateSignup, validateEditProfile } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, username, emailId, password, age } = req.body;

  try {
    validateSignup(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      username,
      emailId,
      password: passwordHash,
      age,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { username, emailId, password } = req.body;
  try {
    let account;

    //check if username and emailId is valid
    if (username) {
      account = await User.findOne({ username });
    } else if (emailId) {
      account = await User.findOne({ emailId });
    } else {
      throw new Error("Please provide email address");
    }

    if (account) {
      //check if password is valid
      const isPasswordValid = await account.validatePassword(password);
      if (isPasswordValid) {
        //create a JWT Token
        const token = await account.createJWT();
        //send token as a cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.status(200).json({ message: "Login successful", data: account });
      } else {
        throw new Error("Password is incorrect!Please try again!");
      }
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logged out successfully");
});

module.exports = authRouter;
