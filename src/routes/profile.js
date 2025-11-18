const express = require('express');
const profileRouter = express.Router();

const userAuth = require('../middlewares/auth');
const User = require("../models/user");
const { validateEditProfile } = require('../utils/validation');

profileRouter.get("/profile/view", userAuth, async(req,res) => {
 

  try{
    res.send(`Welcome <b>${req.user.firstName + " " + req.user.lastName}</b>!!!`);
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
    
    // await loggedInUser.save();
    res.json({message: "Profile updated successfully", data:loggedInUser})

  }catch(err){
    res.status(404).send(err.message)
  }
  
})

profileRouter.patch("/resetPassword", userAuth, async (req, res) => {
  const { emailId, password, newPassword } = req.body;
  try {
    const account = await User.findOne({ emailId });
    const isPasswordValid = User.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Password is incorrect");
    } else {
      const newHashPassword = bcrypt.hash(newPassword, 10);
      account.password = newHashPassword;
      res.send("You can now try your new password");
    }
  } catch (err) {
    res.status(400).send("Reset Failed" + err.message);
  }
});

module.exports = profileRouter;