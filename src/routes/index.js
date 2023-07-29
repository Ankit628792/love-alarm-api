var express = require("express");
var router = express.Router();
var auth = require('./auth.route')
var user = require('./user.route')
var ring = require('./ring.route');
var developer = require('./developer.route');
var conversation = require('./conversation.route');
var webhook = require('./webhook.route');

router.use('/auth', auth)
router.use('/user', user)
router.use('/ring', ring)
router.use('/developer', developer)
router.use('/conversation', conversation)
router.use('/webhook', webhook)


module.exports = router;