const { Schema, model } = require('mongoose');

/**
 * @typedef {Object} Attachment
 * @property {string} filename - Name of the uploaded file.
 * @property {string} url - URL to access the attachment.
 * @property {string} [type] - MIME type or custom type of the attachment.
 */

/**
 * @typedef {Object} TestProperties
 * @property {boolean} isRandomQuestions - If true, test questions are randomized.
 * @property {Object} questionCountByType - Defines how many questions per type.
 * @property {number} questionCountByType.single - Count of single-answer questions.
 * @property {number} questionCountByType.multiple - Count of multiple-answer questions.
 * @property {number} questionCountByType.short - Count of short-answer questions.
 * @property {number} questionCountByType.long - Count of long-answer questions.
 * @property {number} timeLimit - Time limit for test in minutes.
 * @property {Date} [startDate] - When the test becomes available.
 * @property {Date} [endDate] - When the test is no longer available.
 * @property {number} [testLimit] - The duration (in minutes) allowed for a student to complete the test once started.
 */

/**
 * @typedef {Object} TestReference
 * @property {import('mongoose').Types.ObjectId} test - Reference to a Test object.
 * @property {TestProperties} testProperties - Configuration of the test behavior.
 */

/**
 * @typedef {Object} Material
 * @property {string} title - Title of the material.
 * @property {string} [description] - Description or content of the material.
 * @property {'material' | 'practice' | 'practice_with_test'} type - Type of material.
 * @property {Date} [dueDate] - Deadline for submitting the material (for assignments/practice).
 * @property {number} [points] - Max points/score for the material.
 * @property {import('mongoose').Types.ObjectId} course_id - Associated course ID.
 * @property {Attachment[]} [attachments] - Files attached to the material.
 * @property {Date} [availableFrom] - When the material becomes visible to students.
 * @property {boolean} isAvailableToAll - Whether the material is visible to all students by default.
 * @property {Date} createdAt - Date when the material was created.
 * @property {TestReference} [test] - Optional test associated with the material.
 */

/**
 * Material Schema
 * 
 * Represents a learning resource that can be of type:
 * - Static learning material
 * - Practice assignment
 * - Practice with attached test
 * 
 * Features:
 * - Supports file attachments
 * - Linked to a course
 * - Optionally has an associated test with customizable settings
 * - Can have visibility settings and due dates
 */
const MaterialSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['material', 'practice', 'practice_with_test'], required: true },
    dueDate: { type: Date },
    points: { type: Number },
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    attachments: [
        {
            filename: { type: String, required: true },
            url: { type: String, required: true },
            type: { type: String }
        }
    ],
    availableFrom: { type: Date },
    isAvailableToAll: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    test: {
        test: { type: Schema.Types.ObjectId, ref: 'Test' },
        testProperties: {
            isRandomQuestions: { type: Boolean, default: false },
            questionCountByType: {
                single: { type: Number, default: 0 },
                multiple: { type: Number, default: 0 },
                short: { type: Number, default: 0 },
                long: { type: Number, default: 0 },
            },
            timeLimit: { type: Number, default: 0 },
            startDate: { type: Date },
            endDate: { type: Date },
            testLimit: { type: Number }
        }
    }
});

/**
 * Mongoose model for the `Material` collection.
 */
module.exports = model('Material', MaterialSchema);
