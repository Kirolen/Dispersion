const { Router } = require('express');
const messageController = require('../Controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware')

const router = new Router();

router.post('/mark-last-course-message', messageController.markLastCourseMessageAsRead )
router.post('/add-message', authMiddleware, messageController.addMessage);
router.get('/get-messages/:course_id', authMiddleware, messageController.getMessages)
router.get('/get-courses-with-unread-messages/:user_id', messageController.findCoursesWithUnreadMessages)

module.exports = router;