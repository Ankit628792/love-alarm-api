var express = require("express");
var router = express.Router();

const { getNotices } = require("../controller/developer.controller");

router.get('/notice', getNotices)


module.exports = router;