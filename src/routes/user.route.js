var express = require("express");
var router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { updateLocation, updateProfile, updateImage, updateSetting, getProfile, paymentIntent, userFeedback, getPlan, referral, usersNearby, createOrder, blockUser, reportUser, validateEmail } = require("../controller/user.controller");
const { upload } = require("../middleware/user.middleware");

router.get('/test', (req, res) => {
    res.send('hello user')
})

router.patch('/location', authMiddleware, updateLocation);
router.get('/', authMiddleware, usersNearby);
router.get('/validateEmail', validateEmail);
router.patch('/profile', authMiddleware, updateProfile);
router.get('/profile', authMiddleware, getProfile);
router.patch('/image', authMiddleware, upload.single('image'), updateImage);

router.patch('/setting', authMiddleware, updateSetting);

router.post('/create-payment-intent', authMiddleware, paymentIntent)
router.get('/plan', authMiddleware, getPlan);
router.post('/createOrder', authMiddleware, createOrder);
router.post('/referral', authMiddleware, referral);

router.post('/feedback', authMiddleware, userFeedback)
router.post('/block', authMiddleware, blockUser)
router.post('/report', authMiddleware, reportUser)



module.exports = router;
