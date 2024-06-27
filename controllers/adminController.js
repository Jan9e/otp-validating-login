const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

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
