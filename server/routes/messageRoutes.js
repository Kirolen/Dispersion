const { Router } = require('express');
const messageController = require('../Controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware')

const router = new Router();

router.post('/add-message', authMiddleware, messageController.addMessage);
router.get('/get-messages/:course_id', authMiddleware, messageController.getMessages)


module.exports = router;