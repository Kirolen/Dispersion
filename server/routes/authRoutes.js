const Router = require('express');
const router = new Router();
const authController = require('../Controllers/authController'); 
const {check} = require('express-validator')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.post('/registration', 
    [check('email', "Wrong email. Try again").isEmail(),
     check('password', "Password must be longer than 4 characters.").isLength({min: 4})   
    ],
    authController.registration);
router.post('/login', authController.login);
router.get('/users', roleMiddleware("Teacher"), authController.getUsers);
router.get('/info', authController.getInfo);

module.exports = router;
