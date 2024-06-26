const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/userModel');
const transporter = require('../config/email');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex');
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      otp,
      otpExpires,
    });

    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Email sending error:', error);

        // Delete the user if OTP email fails
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({ message: 'Failed to send OTP, please try again' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(201).json({ message: 'OTP sent to email' });
      }
    });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};
