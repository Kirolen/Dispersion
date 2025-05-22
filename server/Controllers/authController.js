const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const secret = process.env.SECRET;

/**
 * Generates a JWT access token.
 * @param {string} id - The user's ID.
 * @param {string} role - The user's role.
 * @param {string} name - The user's full name.
 * @returns {string} The signed JWT token.
 */
const generateAccessToken = (id, role, name) => {
    const payload = {
        id,
        role,
        name
    }
    return jwt.sign(payload, secret, { expiresIn: "24h" })
}

/**
 * @class authController
 * @classdesc Manages user authentication and authorization flows including registration and login.
 *
 * ### Features:
 * - Register new users and authenticate existing ones.
 * - Generate JWT tokens and manage sessions.
 * - Secure endpoints using middleware and roles.
 *
 * @exports authController
 */
class authController {
    /**
    * Handles user registration.
    * Validates input, checks for existing user, hashes password, and saves new user.
    * @param {import('express').Request} req - The request object.
    * @param {import('express').Response} res - The response object.
    * @returns {Promise<void>} 
    */
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validation error', errors: errors.array() });
            }
            const { first_name, last_name, email, password, role } = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({ message: 'User with this email is already registered' });
            }
            const hashPassword = bcrypt.hashSync(password, 7)

            const user = new User({ first_name, last_name, email, password: hashPassword, role })
            user.save()
            return res.json({ success: true, message: 'Registration successful' });
        } catch (e) {
            res.status(500).json({ message: 'Registration error', e });
        }
    }

    /**
   * Handles user login.
   * Checks if user exists, verifies password, and returns JWT token.
   * @param {import('express').Request} req - The request object.
   * @param {import('express').Response} res - The response object.
   * @returns {Promise<void>} 
   */
    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({ message: `User with ${email} is undefind!` });
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(401).json({ message: `Wrong passwrod!` });
            }
            const token = generateAccessToken(user._id, user.role, (user.first_name + " " + user.last_name))

            return res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Login error', error });
        }
    }
}

module.exports = new authController();
