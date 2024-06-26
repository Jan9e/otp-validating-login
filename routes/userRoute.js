const express = require('express');
const { registerUser,verifyOtp,updateUserInfo, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.put('/update-info', updateUserInfo);
router.post('/login', loginUser);

module.exports = router;
