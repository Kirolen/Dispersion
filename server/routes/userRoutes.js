const Router = require('express');
const router = new Router();
const authMiddleware = require('../middlewares/authMiddleware')
const userController = require('../Controllers/userController'); 

router.post('/update-info', authMiddleware, userController.updateUserInfo);
router.get('/info', authMiddleware, userController.getUserInfo)

module.exports = router;
