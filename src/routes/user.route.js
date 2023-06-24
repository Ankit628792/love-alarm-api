var express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { updateLocation, updateProfile, updateImage, getAlarmRings, ringLoveAlarm, pauseRinging, updateSetting, getProfile } = require("../controller/user.controller");
const { upload } = require("../middleware/user.middleware");
var router = express.Router();

router.get('/test', (req, res) => {
    res.send('hello')
})

router.patch('/location', authMiddleware, updateLocation);
router.patch('/profile', authMiddleware, updateProfile);
router.get('/profile', authMiddleware, getProfile);
router.patch('/image', authMiddleware, upload.single('image'), updateImage);

router.get('/ring', authMiddleware, getAlarmRings);
router.post('/ring', authMiddleware, ringLoveAlarm);
router.patch('/ring', authMiddleware, pauseRinging);

router.patch('/setting', authMiddleware, updateSetting)

module.exports = router;
