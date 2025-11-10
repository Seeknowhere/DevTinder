const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
const connectDB = require("./config/database");
const User = require("./models/user");
const userAuth = require('./middlewares/auth')
const validateSignup = require("./utils/validation");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;


app.use(express.json());  
app.use(cookieParser())

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
      const isPasswordValid = User.validatePassword(password);
      if (isPasswordValid) {
        //create a JWT Token
        const token = User.createJWT();
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

app.get("/profile", userAuth, async(req,res) => {
 
  try{
    res.send(`Welcome <b>${req.user.firstName}</b>!!!`);
  }catch(err){
    res.status(401).send("Invalid or expired token " + err.message)
  }
  
})

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users === 0) {
      res.status(404).send("User not found");
    } else {
      const nameList = users
        .map((user) => {
          return `<li>${user.firstName} : ${user.age}</li>`;
        })
        .join("");

      res.send(`<h1>Found Users:</h1><ul>${nameList}</ul>`);
    }
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send(users.firstName + " " + users.lastName);
  } catch (err) {
    res.status(404).send("not found");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const body = req.body;
  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

  try {
    const isUpdateAllowed = Object.keys(body).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const users = await User.findOneAndUpdate({ _id: userId }, body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(users.firstName + " " + users.lastName);
  } catch (err) {
    res.status(404).send("update is unsuccessful:" + err.message);
  }
});

app.patch("/resetPassword", userAuth,  async (req, res) => {
  const { emailId, password, newPassword } = req.body;
  try {
    const account = await User.findOne({ emailId });
    const isPasswordValid =  User.validatePassword(password);
    
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

app.post("/logout" , async (req,res) => {
  res.clearCookie("token");
  res.status(200).send("Logged out successfully");
})

connectDB()
  .then(() => {
    console.log("DB is connected");
    app.listen(PORT, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
