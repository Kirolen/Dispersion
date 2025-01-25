const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('../Config/config')
const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.status(500).json({ message: 'Registration error', errors });
            }
            const {first_name, last_name, email, password, role} = req.body;
            const candidate = await User.findOne({email});
            if (candidate) {
                return res.status(500).json({ message: 'User with this email is registered', error });
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const user = new User({first_name, last_name, email, password: hashPassword, role})
            user.save()
            return res.json({ message: 'Registration successful' });
        } catch (e) {
            res.status(500).json({ message: 'Registration error', e });
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user){
                return res.status(500).json({ message: `User with ${email} is undefind!`});
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(500).json({ message: `Wrong passwrod!`});
            }
            const token = generateAccessToken(user._id, user.role)

            return res.json({token});
        } catch (error) {
            res.status(500).json({ message: 'Login error', error });
        }
    }

    // Define the getUsers method
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json({users});
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    }
}

module.exports = new authController();
