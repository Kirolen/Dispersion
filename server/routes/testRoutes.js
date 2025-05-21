const { Router } = require('express');
const testController = require('../Controllers/testController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = new Router();


router.post('/create', authMiddleware, testController.createTest);
router.get('/', testController.getTests);
router.get('/:id', testController.getTestById);
router.put('/:id', testController.updateTest);
router.post('/start/:material_id',authMiddleware, testController.startTest);
router.post('/take/:material_id',authMiddleware, testController.takeTest);
router.get('/attempt/:material_id/:student_id', authMiddleware, testController.getAttempt)
router.post('/score-update/:material_id/:student_id', authMiddleware, testController.updateScore)
module.exports = router;