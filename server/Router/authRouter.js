const Router = require('express');
const router = new Router();
const controller = require('../Controllers/authController'); // Import without `.default`
const {check} = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.post('/registration', 
    [check('email', "Wrong email. Try again").isEmail(),
     check('password', "Password must be longer than 4 characters.").isLength({min: 4})   
    ],
    controller.registration);
router.post('/login', controller.login);
router.get('/users', roleMiddleware("Teacher"), controller.getUsers);

module.exports = router;
