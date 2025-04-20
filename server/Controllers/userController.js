const User = require('../Models/User');
const bcrypt = require('bcryptjs');

class userController {
    async updateUserInfo(req, res) {
        try {
            const user = req.user;
            const { first_name, last_name, email, bio, password, confirmPassword, avatar } = req.body;

            const userExist = await User.findById(user.id);
            if (!userExist) {
                return res.status(404).json({ success: false, message: "User not found!", data: {} });
            }

            if (password && password !== confirmPassword) {
                return res.status(400).json({ success: false, message: "Passwords don't match", data: {} });
            }

            if (password && await bcrypt.compare(password, userExist.password)) {
                return res.status(400).json({ success: false, message: "New password must be different from the old one", data: {} });
            }

            if (first_name) userExist.first_name = first_name.trim();
            if (last_name) userExist.last_name = last_name.trim();
            if (email) userExist.email = email.trim();
            if (bio) userExist.bio = bio.trim();
            if (avatar) userExist.avatar = avatar;

            if (password && password.trim()) {
                const salt = await bcrypt.genSalt(10);
                userExist.password = await bcrypt.hash(password.trim(), salt);
            }

            await userExist.save(); 

            return res.status(200).json({
                success: true,
                message: "User info updated successfully",
                data: {
                    id: userExist._id,
                    first_name: userExist.first_name,
                    last_name: userExist.last_name,
                    email: userExist.email,
                    bio: userExist.bio,
                    avatar: userExist.avatar
                }
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ success: false, message: "Server error", data: {} });
        }
    }

    async getUserInfo(req, res) {
        try {
            const user = req.user;
            const userExist = await User.findById(user.id).select('-password');

            if (!userExist) {
                return res.status(404).json({ success: false, message: "User not found!", data: {} });
            }

            return res.status(200).json({
                success: true,
                message: "User info retrieved successfully",
                data: userExist
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ success: false, message: "Server error", data: {} });
        }
    }
}

module.exports = new userController();
