var express = require("express");
var router = express.Router();

const { getNotices, getAllPlans, addNotice } = require("../controller/developer.controller");

router.get('/notice', getNotices)
router.get('/plans', getAllPlans)
router.post('/notice', addNotice)


module.exports = router;