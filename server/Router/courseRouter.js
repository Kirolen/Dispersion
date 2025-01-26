const { Router } = require('express');
const courseController = require('../Controllers/courseController');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

const router = new Router();

router.post(
    '/add-courses',
    [   authMiddleware,
        body('course_name').notEmpty().withMessage('Course name is required'),
        body('teacher_id').notEmpty().withMessage('Teacher ID is required')
    ],
    courseController.addCourse
);
router.post('/join-course', authMiddleware, courseController.joinCourse);
router.get('/get-students', roleMiddleware("Teacher"), courseController.getStudentsByCourse)
router.get('/get-my-courses', authMiddleware, courseController.getCourse)

module.exports = router;
