const { Schema, model } = require('mongoose');

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

module.exports = model('CalendarEvent', CalendarEvent);
