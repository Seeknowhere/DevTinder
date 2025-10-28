const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect(
        'mongodb+srv://shairrrrr_db_user:Seekyefirst%4007@cluster0.e1m8t0n.mongodb.net/?appName=Cluster0'
    )
}
module.exports = connectDB;
