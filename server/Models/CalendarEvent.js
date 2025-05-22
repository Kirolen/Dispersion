const { Schema, model } = require('mongoose');

/**
 * @typedef {Object} CalendarEvent
 * @property {Schema.Types.ObjectId} user_id - Reference to the user associated with the calendar event.
 * @property {string} title - Title or name of the event.
 * @property {'Meeting'|'Assignment'|'Test'} eventType - The type of the calendar event.
 * @property {Date|null} [startDate] - The start date and time of the event.
 * @property {Date|null} [endDate] - The end date and time of the event.
 */

/**
 * Mongoose schema for a calendar event.
 * This model represents events such as meetings, assignments, or tests linked to a specific user.
 * 
 * Features:
 * - Associates an event with a user (`user_id`)
 * - Supports classification by type (`eventType`: 'Meeting', 'Assignment', 'Test')
 * - Includes optional start and end dates
 */
const CalendarEvent = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    eventType: {
        type: String,
        enum: ['Meeting', 'Assignment', 'Test'],
        default: 'Meeting'
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null }
}, { timestamps: false, versionKey: false });

/**
 * CalendarEvent model for managing scheduled user activities.
 */
module.exports = model('CalendarEvent', CalendarEvent);
