const express = require('express');
const { registerUser,verifyOtp,updateUserInfo } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.put('/update-info', updateUserInfo);

module.exports = router;
