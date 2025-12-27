const express = require('express');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const userAuth = require('../middlewares/auth');
const User = require("../models/user");
const { validateEditProfile } = require('../utils/validation');

profileRouter.get("/profile/view", userAuth, async(req,res) => {
 

  try{
    res.json({data: req.user});
  }catch(err){
    res.status(401).send("Invalid or expired token " + err.message)
  }
  
})

profileRouter.patch("/profile/edit", userAuth, async(req,res) => {
  
  
  try {
    if(!validateEditProfile(req)){
      throw new Error("Some fields are not editable")
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    
    await loggedInUser.save();
    res.json({message: "Profile updated successfully", data:loggedInUser})

  }catch(err){
    res.status(404).send(err.message)
  }
  
})

profileRouter.patch("/resetPassword", userAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const loggedInUserId = req.user._id;
  try {
    const account = await User.findById(loggedInUserId);
    const isPasswordValid = await account.validatePassword(oldPassword);

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    } 

    const newHashPassword = await bcrypt.hash(newPassword, 10);

    account.password = newHashPassword;
    await account.save();

    return res.send("Password has been reset successfully");
    
  } catch (err) {
    return res.status(500).send("Reset Failed" + err.message);
  }
});

module.exports = profileRouter;