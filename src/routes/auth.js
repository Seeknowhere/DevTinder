const express = require('express');
const authRouter = express.Router();

const {validateSignup, validateEditProfile} = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');


authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, userName, emailId, password, age } = req.body;

  try {
    validateSignup(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      userName,
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
  const { userName, emailId, password } = req.body;
  try {
    let account;

    //check if username and emailId is valid
    if (userName) {
      account = await User.findOne({ userName });
    } else if (emailId) {
      account = await User.findOne({ emailId });
    } else {
      throw new Error("Please provide either email or username");
    }

    if (account) {
      //check if password is valid
      const isPasswordValid = await account.validatePassword(password);
      if (isPasswordValid) {
        //create a JWT Token
        const token = await account.createJWT();
        //send token as a cookie
        res.cookie("token", token, {
          // httpOnly: true,
          // // secure: true,
          // sameSite: "strict"
         
        });
        res.status(200).json({ message: "Login successful"});
      } else {
        throw new Error("Password is incorrect");
      }
    } else {
      throw new Error("Account not found. Check typos or just sign up");
    }
  } catch (err) {
    res.status(400).send("Login Failed: " + err.message);
  }
});

authRouter.post("/logout" , async (req,res) => {
  res.clearCookie("token");
  res.status(200).send("Logged out successfully");
})

module.exports = authRouter;