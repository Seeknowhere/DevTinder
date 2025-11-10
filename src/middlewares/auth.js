const jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = async (req,res,next) => {
    
    try {
        //read the token from the req cookies
        const { token } = req.cookies;
        if(!token){
            throw new Error("You are not logged in. Please login or signup");
        }

        //validate the token
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        
        //find the user
        const user = await User.findById(decoded._id);
        if(!user){
            throw new Error("User not Found");
        }
        req.user = user;
        next();
    }catch(err) {
        console.error(err);
        res.status(401).send(err.message)
    }
  
}
module.exports = userAuth
