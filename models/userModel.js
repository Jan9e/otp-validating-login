const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  location: { type: String },
  age: { type: Number },
  work: { type: String },
  dob: { type: Date },
  description: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
