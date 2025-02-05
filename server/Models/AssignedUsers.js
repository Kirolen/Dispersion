const { Schema, model } = require('mongoose');

const AssignedUsersSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    material_id: { type: Schema.Types.ObjectId, ref: 'Material', required: true }, 
    response: [{
        message: { type: String, required: true },
        name: { type: String, required: true },
        created_at: { type: Date, default: Date.now }
    }],
    grade: { type: Number, default: null },
    userFile: { type: Object, default: {} },
    status: { 
        type: String, 
        enum: ['active', 'passed_in_time', 'graded', 'not_passed', 'passed_with_lateness'], 
        default: 'active' 
    }
}, { timestamps: true });

module.exports = model('AssignedUsers', AssignedUsersSchema);
