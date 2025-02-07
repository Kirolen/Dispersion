const Router = require('express');
const router = new Router();
const materialController = require('../Controllers/materialController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/add-material', roleMiddleware("Teacher"), materialController.addTask);
router.get('/get-all-course-material/:courseId', roleMiddleware("Teacher"), materialController.getAllCourseMaterials);
router.get('/get-students-tasks-result/:materialId', roleMiddleware("Teacher"), materialController.getStudentsTaskResult);
router.post('/grade-student-task', roleMiddleware("Teacher"), materialController.gradeTask)
router.get('/get-filtered-courses/:userId', roleMiddleware("Teacher"), materialController.getFilteredCourses)

router.get('/get-course-material-for-student/:courseId', materialController.getCourseMaterialsForStudent);
router.get('/get-task-info-for-student/:materialId', materialController.getStudentTaskInfo);
router.get('/get-student-task-result/:courseId', materialController.getStudentTasksResult);
router.post('/hand-in-task', roleMiddleware("Student"), materialController.handInTask)
router.get('/get-all-course-tasks/:userId', materialController.getAllStudentAssigments)

module.exports = router;