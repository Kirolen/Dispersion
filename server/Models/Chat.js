const { Schema, model } = require('mongoose');

const CourseOwner = new Schema({
    user_1: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    teacher_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    last_read_message: { type: Schema.Types.ObjectId, ref: 'CourseMessage', default: null},
});

module.exports = model('CourseOwner', CourseOwner);
