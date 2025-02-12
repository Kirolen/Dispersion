const { Router } = require('express');
const chatController = require('../Controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware')

const router = new Router();


router.get('/search-user/:keyWord', authMiddleware, chatController.searchUsers);
router.post("/create", authMiddleware, chatController.createChat);
router.get("/user-chats", authMiddleware, chatController.getUserChats);
router.get('/chat/:chatId', authMiddleware, chatController.getChat);

router.get('/get-unread-chats', authMiddleware, chatController.findUnreadChats)
router.post('/mark-last-message', chatController.markLastCourseMessageAsRead )
module.exports = router;
