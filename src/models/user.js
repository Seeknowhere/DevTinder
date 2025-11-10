const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = Schema({
  firstName: {
    type: String,
    required: true,
    maxLength:50
  },
  lastName: {
    type: String,
    maxLength: 50
  },
  userName: {
    type: String,
    unique: true,
    minLength:3,
    maxLength:20,
    required: true,
    trim:true,
    match:/^[a-zA-Z][a-zA-Z0-9_]+$/
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /.+\@.+\..+/,
    validator(value){
      if(!validator.isEmail(value)){
        throw new Error("Email not valid")
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
    validate: {
      validator: function(v){
        validator.isStrongPassword(v)
      }
    }
  },
  age: {
    type: Number,
    min: 18,
    max:100
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    },
  },
  photoUrl: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Sorry, photo not a valid uri format")
      }
    }
  },
  about: {
    type: String,
    maxLength: 100,
  },
  skills: {
    type: [String],
    validate: {
      validator: function(v) {
        // const unique = new Set(v);
        return ( 
          v.length <= 10 
          // unique.size === v.length 
         ) 
      },
      message:"You can only have up to 10 skills or check if there's duplicates"
    }
  },
},

{
    timestamps: true
});

userSchema.methods.validatePassword = async function(passwordInputByUser){

 const isPasswordValid = await bcrypt.compare(passwordInputByUser,this.password)
 return isPasswordValid;

}
userSchema.methods.createJWT = async function(){
  const token = jwt.sign({
    _id:this.id,
    emailId:this.emailId
  }, process.env.SECRET_KEY, { expiresIn: "1h"})

  return token;
}

//mongoose model

const userModel = model("User", userSchema);

module.exports = userModel;
