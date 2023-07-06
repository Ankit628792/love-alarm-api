var express = require("express");
var router = express.Router();
var auth = require('./auth.route')
var user = require('./user.route')
var ring = require('./ring.route');
var developer = require('./developer.route');

router.use('/auth', auth)
router.use('/user', user)
router.use('/ring', ring)
router.use('/developer', developer)


module.exports = router;