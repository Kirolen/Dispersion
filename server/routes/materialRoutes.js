const Router = require('express');
const router = new Router();
const materialController = require('../Controllers/materialController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/send-material', roleMiddleware("Teacher"), materialController.sendMaterial);
router.get('/get-material/:courseId', materialController.getMaterial);
router.get('/get-all-material/:courseId', materialController.getAllCourseMaterials);
router.get('/get-material-info/:materialID', materialController.getMaterialInfo);
module.exports = router;