const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

// Register a new admin
exports.registerAdmin = async (req, res) => {
  const { username, email, password, invitationCode } = req.body;

  // Check if the invitation code is correct
  if (invitationCode !== process.env.ADMIN_INVITATION_CODE) {
    return res.status(401).json({ message: 'Invalid invitation code' });
  }

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Error registering admin:', err.message);
    res.status(500).send('Server error');
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
    const { emailOrUsername, password } = req.body;
  
    try {
      // Find admin by email or username
      const admin = await Admin.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
      if (!admin) {
        return res.status(400).json({ message: 'username not found' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
  
      // Create JWT Payload
      const payload = {
        admin: {
          id: admin.id,
        },
      };
  
      // Sign the token
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
      console.error('Error logging in admin:', err.message);
      res.status(500).send('Server error');
    }
  };