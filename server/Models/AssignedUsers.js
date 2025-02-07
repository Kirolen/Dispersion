const { Schema, model } = require('mongoose');

const AssignedUsersSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    material_id: { type: Schema.Types.ObjectId, ref: 'Material', required: true }, 
    response: {
        message: { type: String },
        name: { type: String,  },
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

module.exports = model('AssignedUsers', AssignedUsersSchema);
