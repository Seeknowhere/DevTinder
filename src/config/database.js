const mongoose = require('mongoose');
require("dotenv").config();
const DB_URI    = process.env.DB_URI;

const connectDB = async() => {
    await mongoose.connect(
       DB_URI
    )
}
module.exports = connectDB;
