var express = require("express");
const { razorpayWebhook, stripeWebhook } = require("../controller/webhook.controller");
var router = express.Router();

router.post('/razorpay', express.raw({ type: 'application/json' }), razorpayWebhook)
router.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook)

module.exports = router;