const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = Schema({
    firstName : {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }

})

//mongoose model

const userModel = model("User", userSchema);

module.exports = userModel;