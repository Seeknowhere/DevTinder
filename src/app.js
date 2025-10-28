const { adminAuth, userAuth } = require("./middlewares/auth.js")
const express = require('express');
const connectDB = require("./config/database")
const User = require('./models/user');
const app = express();


app.post("/signup",async (req, res) => {
    const userObj = {
        firstName: 'karol',
        lastName: 'Mallari',
        emailId: 'karol@gmail.com',
        password: '1234',
        age: 78,
        gender: 'male'
    }
    //creating a new instance of the User Model
    const user = new User(userObj);
    await user.save();
    res.send("User added successfully")

})




connectDB()
    .then(() => {
        console.log("DB is connected")
        app.listen(3000 , () => {
        console.log("Server is listening on port 3000")
        });
}).catch(err=>{
    console.error("Database cannot be connected")
})

