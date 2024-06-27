const express = require('express');
const { registerUser,verifyOtp, addUserInfo, updateUserInfo, loginUser, getUserInfo, getUserDetails, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const  authAdmin  = require('../middleware/authAdmin');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.put('/update-info', addUserInfo);
router.post('/login', loginUser);
router.get('/me', auth, getUserInfo);
router.put('/me', auth, updateUserInfo);



module.exports = router;
