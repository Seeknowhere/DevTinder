const express = require('express');

const app = express();


app.use("/admin", (req,res,next) => {
    console.log("admin authorization is checked!")
    const token = 'xyz';
    const isAuthorized = token === 'xyz';

    if(!isAuthorized){
        res.status(401).send("Unauthorized");
    }else{
        next();
    }
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