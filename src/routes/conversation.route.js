var express = require("express");
const { getConversations, updateConversation } = require("../controller/conversation.controller");
var router = express.Router();


router.get('/', getConversations);
router.patch('/', updateConversation);


module.exports = router;