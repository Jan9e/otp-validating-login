const express = require('express');
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const { getAllUsers } = require('../controllers/userController');
const  authAdmin  = require('../middleware/authAdmin');
const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Get all users (admin only)
router.get('/users', authAdmin, getAllUsers);

module.exports = router;
