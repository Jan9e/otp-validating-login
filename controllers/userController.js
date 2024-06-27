const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/userModel');
const transporter = require('../config/email');
const jwt = require('jsonwebtoken');

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

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    let user = await User.findOne({ email, otp });
    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Clear the OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};


exports.updateUserInfo = async (req, res) => {
  const { email, location, age, work, dob, description } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has verified OTP
    if (user.otpExpires !== undefined) {
      return res.status(400).json({ message: 'OTP verification required' });
    }

    user.location = location || user.location;
    user.age = age || user.age;
    user.work = work || user.work;
    user.dob = dob || user.dob;
    user.description = description || user.description;

    await user.save();
    res.status(200).json({ message: 'User information updated successfully' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};


exports.loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) {
      return res.status(400).json({ message: 'user not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error logging in user:', err.message);
    res.status(500).send('Server error');
  }
};


// Get user information
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires'); // Exclude sensitive fields
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error retrieving user information:', err.message);
    res.status(500).send('Server error');
  }
};


// Update user information
exports.updateUserInfo = async (req, res) => {
  const { location, age, work, dob, description } = req.body;

  // Check if at least one field is provided
  if (location === undefined && age === undefined && work === undefined && dob === undefined && description === undefined) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (location !== undefined) user.location = location;
    if (age !== undefined) user.age = age;
    if (work !== undefined) user.work = work;
    if (dob !== undefined) user.dob = dob;
    if (description !== undefined) user.description = description;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Error updating user information:', err.message);
    res.status(500).send('Server error');
  }
};


//get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find({}, 'username'); // Only select the 'username' field
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error');
  }
};
