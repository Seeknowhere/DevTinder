const { adminAuth, userAuth } = require("./middlewares/auth.js")
const express = require('express');

const app = express();


app.use("/admin", adminAuth);

app.get("/user", userAuth, (req,res) => {
    res.send("All Data Sent");
})

app.get("/admin/getAllData", (req,res) => {
    res.send("All Data Sent");
})
app.get("/admin/deleteUser", (req,res) => {
    res.send("Deleted a user");
})



app.listen(3000 , () => {
    console.log("Server is listening on port 3000")
});