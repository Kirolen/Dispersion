const User = require('../Models/User');
const bcrypt = require('bcryptjs');

/**
 * @class userController
 * @classdesc
 * Handles operations related to user profile management such as:
 * - Updating user information including name, email, password, bio, and avatar.
 * - Fetching authenticated user profile data.
 * 
 * This controller assumes that authentication middleware has attached the authenticated user
 * object to the request (`req.user`). It uses MongoDB with Mongoose for data access.
 */
class userController {
    /**
    * Update authenticated user's profile information.
    *
    * Features:
    * - Allows updating first name, last name, email, bio, avatar.
    * - Supports password change with hashing and validation.
    * - Prevents using the same password again.
    * 
    * @async
    * @function
    * @param {Object} req - Express request object.
    * @param {Object} req.user - The authenticated user object (from middleware).
    * @param {Object} req.body - Request payload with fields to update.
    * @param {string} [req.body.first_name] - New first name of the user.
    * @param {string} [req.body.last_name] - New last name of the user.
    * @param {string} [req.body.email] - New email address.
    * @param {string} [req.body.bio] - User bio or description.
    * @param {string} [req.body.password] - New password to set.
    * @param {string} [req.body.confirmPassword] - Confirmation for the new password.
    * @param {string} [req.body.avatar] - URL or base64 string for user avatar.
    * 
    * @param {Object} res - Express response object.
    * 
    * @returns {Object} JSON response indicating success or error.
    * 
    * @throws {500} On server or database error.
    */
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

    /**
     * Get authenticated user's profile information.
     * 
     * Features:
     * - Fetches profile data except for the password field.
     * - Intended for use on user dashboard or account settings.
     * 
     * @async
     * @function
     * @param {Object} req - Express request object.
     * @param {Object} req.user - The authenticated user object (from middleware).
     * @param {Object} res - Express response object.
     * 
     * @returns {Object} JSON response containing user profile data.
     * 
     * @throws {500} On database retrieval error.
     */
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
