const {Schema, model} = require('mongoose')

/**
 * @typedef {Object} User
 * @property {string} first_name - The user's first name. (Required)
 * @property {string} last_name - The user's last name. (Required)
 * @property {string} email - The user's email address, must be unique. (Required)
 * @property {string} password - The user's hashed password. (Required)
 * @property {'Student'|'Teacher'} role - The role of the user in the system. (Required)
 * @property {string} [bio] - Optional biography or description about the user.
 * @property {string} [avatar] - URL or path to the user's avatar image.
 */

/**
 * User Schema
 * 
 * Represents a user within the system, who can be either a Student or a Teacher.
 * Features:
 * - Stores personal details like first and last name.
 * - Unique email for authentication.
 * - Password storage for security.
 * - Role defines user permissions and access.
 * - Optional bio and avatar for user profile customization.
 */
const User = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: { type: String, enum: ['Student', 'Teacher'], required: true },
    bio: {type:String},
    avatar: {type: String}
})

/**
 * Mongoose model for the `TesUser` collection.
 */
module.exports = model('User', User)