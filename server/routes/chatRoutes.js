const { Router } = require('express');
const chatController = require('../Controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware')

const router = new Router();


router.get('/search-user/:keyWord', authMiddleware, chatController.searchUsers);
router.post("/create", authMiddleware, chatController.createChat);
router.get("/user-chats", authMiddleware, chatController.getUserChats);
router.get('/chat/:chatId', authMiddleware, chatController.getChat);

router.post("/send-message", authMiddleware, chatController.sendMessage);
router.get("/get-messages/:chatId", authMiddleware, chatController.getMessages);

module.exports = router;
