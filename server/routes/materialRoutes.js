const Router = require('express');
const router = new Router();
const materialController = require('../Controllers/materialController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware')


router.post('/add-material', roleMiddleware("Teacher"), materialController.addTask);
router.get('/get-all-course-material/:courseId', roleMiddleware("Teacher"), materialController.getAllCourseMaterials);
router.get('/get-students-tasks-result/:materialId', roleMiddleware("Teacher"), materialController.getStudentsTaskResult);
router.post('/grade-student-task', roleMiddleware("Teacher"), materialController.gradeTask)
router.get('/get-filtered-courses-assignments-teacher/:userId', roleMiddleware("Teacher"), materialController.getFilteredAssignmentsByTeacher)
router.get('/get-material-info/:assignmentId', roleMiddleware("Teacher"), materialController.getMaterialInfo)
router.post('/update-material-info/:assignmentId', authMiddleware, roleMiddleware("Teacher"), materialController.updateMaterialInfo)
router.delete('/delete-material/:assignmentId', authMiddleware, roleMiddleware("Teacher"), materialController.deleteAssignment)

router.get('/get-course-material-for-student/:courseId', materialController.getCourseMaterialsForStudent);
router.get('/get-task-info-for-student/:materialId', materialController.getStudentTaskInfo);
router.get('/get-student-task-result/:courseId', materialController.getStudentTasksResult);
router.get('/get-filtered-courses-assignments-student/:userId', materialController.getFilteredAssignmentsByStudent)

router.post('/hand-in-task', materialController.submitSubmission)
router.post('/update-student-task', materialController.updateStudentTask)
router.get('/get-submission/:material_id/:user_id', materialController.getSubmission);


module.exports = router;