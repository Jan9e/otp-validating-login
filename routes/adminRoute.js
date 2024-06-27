const express = require('express');
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const { getAllUsers, getUserDetails, deleteUser } = require('../controllers/userController');
const  authAdmin  = require('../middleware/authAdmin');
const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Get all users (admin only)
router.get('/users', authAdmin, getAllUsers);

// Get user details by username
router.get('/:username', authAdmin, getUserDetails);

// Delete user by username
router.delete('/:username', authAdmin, deleteUser);



module.exports = router;
