const { Schema, model } = require('mongoose');

/**
 * @typedef {Object} Attachment
 * @property {string} filename - Name of the uploaded file.
 * @property {string} url - URL to the uploaded file.
 * @property {string} [type] - Optional MIME type or file category.
 */

/**
 * @typedef {Object} Response
 * @property {string} [message] - Text response or comment from the user.
 * @property {string} [name] - Optional name or title for the response.
 * @property {Date} [created_at] - Date when the response was created.
 */

/**
 * @typedef {Object} AssignedUsers
 * @property {Schema.Types.ObjectId} user_id - Reference to the assigned user.
 * @property {Schema.Types.ObjectId} material_id - Reference to the material or assignment.
 * @property {Response} [response] - User's response to the material.
 * @property {number|null} [grade] - Grade received for the submission.
 * @property {Attachment[]} [attachments] - List of uploaded files submitted with the assignment.
 * @property {'passed_in_time'|'graded'|'not_passed'|'passed_with_lateness'} status - Status of the submission.
 * @property {Date} [submitted_at] - Date and time the assignment was submitted.
 * @property {Date} createdAt - Timestamp of creation (automatically added).
 * @property {Date} updatedAt - Timestamp of last update (automatically added).
 */
const AssignedUsersSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    material_id: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
    response: {
        message: { type: String },
        name: { type: String, },
        created_at: { type: Date, default: Date.now }
    },
    grade: { type: Number, default: null },
    attachments: [
        {
            filename: { type: String, required: true },
            url: { type: String, required: true },
            type: { type: String }
        }
    ],
    status: {
        type: String,
        enum: ['passed_in_time', 'graded', 'not_passed', 'passed_with_lateness'],
        default: 'not_passed'
    },
    submitted_at: { type: Date, default: Date.now }
}, { timestamps: true });

/**
 * Mongoose model representing assigned materials and user submissions.
 * Used to track assignment progress, responses, grading, and file uploads.
 */
module.exports = model('AssignedUsers', AssignedUsersSchema);
