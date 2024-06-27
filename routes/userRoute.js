const express = require('express');
const { registerUser,verifyOtp,updateUserInfo, loginUser, getUserInfo } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.put('/update-info', updateUserInfo);
router.post('/login', loginUser);
router.get('/me', auth, getUserInfo);

module.exports = router;
