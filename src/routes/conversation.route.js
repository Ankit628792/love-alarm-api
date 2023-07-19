var express = require("express");
const { getConversations, updateConversation, getMessages, addMessage, clearMessages } = require("../controller/conversation.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
var router = express.Router();


router.get('/', authMiddleware, getConversations);
router.patch('/', authMiddleware, updateConversation);
router.post('/messages', authMiddleware, getMessages);
router.post('/messages/clear', authMiddleware, clearMessages);
router.post('/message', authMiddleware, addMessage);


module.exports = router;