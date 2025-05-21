const { Schema, model } = require('mongoose');

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

module.exports = model('Material', MaterialSchema);
