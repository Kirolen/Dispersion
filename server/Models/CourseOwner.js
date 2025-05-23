const { Schema, model } = require('mongoose');

/**
 * @typedef {Object} CourseOwner
 * @property {import('mongoose').Types.ObjectId} course_id - Reference to the course owned by the teacher.
 * @property {import('mongoose').Types.ObjectId} teacher_id - Reference to the user who owns or teaches the course.
 * @property {import('mongoose').Types.ObjectId | null} last_read_message - Reference to the last read course message by the teacher.
 */

/**
 * CourseOwner Schema
 *
 * Represents the ownership of a course by a teacher.
 * This model tracks which user is the teacher of a specific course and optionally stores
 * the last read message for message read tracking within the course context.
 *
 * Features:
 * - Links a course to a teacher via ObjectId references.
 * - Supports tracking of the last message read by the course owner.
 *
 * Relationships:
 * - `course_id` references the `Course` model.
 * - `teacher_id` references the `User` model.
 * - `last_read_message` references the `CourseMessage` model.
 */
const CourseOwner = new Schema({
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    teacher_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    last_read_message: { type: Schema.Types.ObjectId, ref: 'CourseMessage', default: null},
});

/**
 * Mongoose model for the `CourseOwner` collection.
 */
module.exports = model('CourseOwner', CourseOwner);
