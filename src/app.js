const { adminAuth, userAuth } = require("./middlewares/auth.js")
const express = require('express');

const app = express();


app.get("/getUserData", (req,res) => {
    try {
        throw new Error("asdasd");
        res.send("User Data Sent")
    }catch(err) {
        res.status(500).send("There's new error")
    }
})
app.use("/", (err, req,res,next) => {
    if(err){
        res.status(500).send("something went wrong");
    }
})


app.listen(3000 , () => {
    console.log("Server is listening on port 3000")
});