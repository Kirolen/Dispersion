const {Schema, model} = require('mongoose')

/**
 * @typedef {Object} Course
 * @property {string} course_name - The name of the course. Required field.
 * @property {string} course_desc - A brief description of the course. Required field.
 */

/**
 * Course Schema
 * 
 * Represents a course entity in the system. This schema stores the basic information 
 * about a course, including its name and description.
 * 
 * Features:
 * - Stores the course title (`course_name`)
 * - Stores a description (`course_desc`) to provide additional context
 * 
 * Both fields are required.
 */
const Course = new Schema({
    course_name: {type: String, required: true},
    course_desc: {type: String, required: true}
})

/**
 * Mongoose model for interacting with the `Course` collection in MongoDB.
 */
module.exports = model('Course', Course)