const { Schema, model } = require('mongoose');

/**
 * @typedef {Object} CourseAccess
 * @property {import('mongoose').Types.ObjectId} course_id - Reference to the Course the student has access to.
 * @property {import('mongoose').Types.ObjectId} student_id - Reference to the User (student) who has access.
 * @property {import('mongoose').Types.ObjectId|null} last_read_message - Reference to the last message read by the student in the course chat (optional).
 */

/**
 * CourseAccess Schema
 *
 * Represents the access relationship between a student and a course.
 * This schema is used to track which students are enrolled or granted access
 * to specific courses, and optionally, the last message they have read in a course chat.
 *
 * Features:
 * - Links a student (`student_id`) to a course (`course_id`)
 * - Tracks the last read message (`last_read_message`) for chat synchronization
 *
 * All references are stored as ObjectIds and point to their respective collections.
 */
const CourseAccess = new Schema({
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    student_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    last_read_message: { type: Schema.Types.ObjectId, ref: 'Message', default: null},
});

/**
 * Mongoose model for interacting with the `CourseAccess` collection in MongoDB.
 */
module.exports = model('CourseAccess', CourseAccess);
