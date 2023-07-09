var express = require("express");
var router = express.Router();

const { getNotices, getAllPlans } = require("../controller/developer.controller");

router.get('/notice', getNotices)
router.get('/plans', getAllPlans)


module.exports = router;