var express = require("express");
var router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { getAlarmRings, ringLoveAlarm, pauseRinging, getMatches } = require("../controller/ring.controller");


router.get('/', authMiddleware, getAlarmRings);
router.post('/', authMiddleware, ringLoveAlarm);
router.patch('/', authMiddleware, pauseRinging);
router.get('/matches', authMiddleware, getMatches)


module.exports = router;