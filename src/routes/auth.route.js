var express = require("express");
const { sendOtp, verifyOtp, validateUser } = require("../controller/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
var router = express.Router();

router.get('/test', (req, res) => {
    res.send('hello')
})

router.post('/otp/send', sendOtp)
router.post('/otp/verify', verifyOtp)
router.get('/validate', authMiddleware, validateUser)


module.exports = router;