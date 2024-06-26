// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => 
        console.log("DB connection successful"))
    .catch((err) => {
        console.log(err);
    });
};

module.exports = connectDB;
