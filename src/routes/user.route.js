var express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { updateLocation, updateProfile, updateImage, getAlarmRings, ringLoveAlarm, pauseRinging, updateSetting, getProfile } = require("../controller/user.controller");
const { upload } = require("../middleware/user.middleware");
const Rings = require("../models/ring.model");
const Plans = require("../models/plan.model");
const Users = require("../models/user.model");
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




router.get('/seeder/rings', async (req, res) => {
    let arr = [];
    for (let i = 0; i < 10; i++) {
        let data = await Rings.create({
            sender: '6498009120d216f346a50c85',
            receiver: '6498008220d216f346a50c2d',
            location: {
                type: 'Point',
                coordinates: [-21.2327222, 49.8807]
            }
        });
        arr.push(data)
    }
    res.status(200).send({ rings: arr })
});

router.get('/seeder/plan', async (req, res) => {
    let arr = []
    for (let plan of require('../../helpers/constant').plans) {
        let data = await Plans.create(plan);
        arr.push(data)
    }
    res.status(200).send({ plans: arr })
})

router.get('/seeder/user', async (req, res) => {
    let arr = []
    let plan = await Plans.findOne({ planType: 'free' })
    for (let item of require('../../MOCK_DATA.json')) {
        let location = {
            coordinates: [item?.latitude, item?.longitude]
        }
        let obj = {
            plan: plan._id,
            status: 'active',
            "name": item.name,
            "email": item.email,
            "mobile": item.mobile,
            "gender": item.gender,
            "interestedIn": item.interestedIn,
            "image": item.image,
            age: 25,
            location,
            heartId: generateHeartId(7),
            fcmToken: '',
            referralCode: generateReferralCode()
        }
        let data = await Users.create(
            obj
        );
        arr.push(data)
    }
    res.status(200).send({ users: arr })
});


module.exports = router;
