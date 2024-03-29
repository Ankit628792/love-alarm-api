var express = require("express");
var router = express.Router();
const { sendOtp, verifyOtp, validateUser, logout } = require("../controller/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.get('/test', (req, res) => {
    res.send('hello')
})

router.post('/otp/send', sendOtp)
router.post('/otp/verify', verifyOtp)
router.get('/validate', authMiddleware, validateUser);
router.patch('/logout', logout);


module.exports = router;