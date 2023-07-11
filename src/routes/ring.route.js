var express = require("express");
var router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { getAlarmRings, ringLoveAlarm, pauseRinging, getMatches, getTotalRings } = require("../controller/ring.controller");


router.get('/', authMiddleware, getAlarmRings);
router.post('/', authMiddleware, ringLoveAlarm);
router.patch('/', authMiddleware, pauseRinging);
router.get('/matches', authMiddleware, getMatches)
router.get('/total', authMiddleware, getTotalRings)


module.exports = router;