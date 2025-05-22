const {Schema, model} = require('mongoose')

/**
 * @typedef {Object} CourseMessage
 * @property {import('mongoose').Types.ObjectId} course_id - The course this message belongs to.
 * @property {import('mongoose').Types.ObjectId} sender_id - The user who sent the message.
 * @property {string} message - The textual content of the message.
 * @property {Date} [created_at] - The timestamp when the message was created. Defaults to the current date and time.
 */

/**
 * CourseMessage Schema
 *
 * Represents a message sent by a user in the context of a course.
 * This model is used to store and retrieve communication entries associated with a specific course.
 *
 * Features:
 * - Tracks which course the message is related to (`course_id`)
 * - Identifies the sender (`sender_id`)
 * - Stores message text (`message`)
 * - Automatically timestamps when the message was created (`created_at`)
 */
const CourseMessage = new Schema({
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: {type: String, required: true}, 
    created_at: { type: Date, default: Date.now } 
})


/**
 * Mongoose model for the `CourseMessage` collection.
 */
module.exports = model('CourseMessage', CourseMessage)