var express = require("express");
var router = express.Router();

const { getNotices, getAllPlans, addNotice, contact, removePendingProfiles } = require("../controller/developer.controller");

router.get('/notice', getNotices)
router.get('/plans', getAllPlans)
router.post('/notice', addNotice)
router.post('/contact', contact)
router.get('/remove/pending', removePendingProfiles)


module.exports = router;