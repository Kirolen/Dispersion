const Router = require('express');
const router = new Router();
const materialController = require('../Controllers/materialController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/add-material', roleMiddleware("Teacher"), materialController.addTask);
router.get('/get-all-course-material/:courseId', roleMiddleware("Teacher"), materialController.getAllCourseMaterials);
router.get('/get-students-tasks-result/:materialId', roleMiddleware("Teacher"), materialController.getStudentsTaskResult);

router.get('/get-course-material-for-student/:courseId', materialController.getCourseMaterialsForStudent);
router.get('/get-task-info-for-student/:materialId', materialController.getTaskInfoForStudent);
router.get('/get-student-task-result/:courseId', materialController.getStudentTasksResult);
module.exports = router;