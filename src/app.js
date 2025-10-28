const { adminAuth, userAuth } = require("./middlewares/auth.js")
const express = require('express');
const connectDB = require("./config/database")
const app = express();

connectDB()
    .then(() => {
        console.log("DB is connected")
        app.listen(3000 , () => {
        console.log("Server is listening on port 3000")
        });
}).catch(err=>{
    console.error("Database cannot be connected")
})

