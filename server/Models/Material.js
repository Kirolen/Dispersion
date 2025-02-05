const { Schema, model } = require('mongoose');

const MaterialSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['lecture', 'practice'], required: true }, 
    dueDate: { type: Date }, 
    points: { type: Number, min: 0, max: 100 }, 
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    attachments: [
        {
            filename: { type: String, required: true },
            url: { type: String, required: true },
            type: { type: String } 
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('Material', MaterialSchema);
