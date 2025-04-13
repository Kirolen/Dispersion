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
});

module.exports = model('Material', MaterialSchema);
