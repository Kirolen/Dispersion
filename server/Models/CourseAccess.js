const { Schema, model } = require('mongoose');

const CourseAccess = new Schema({
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    student_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    last_read_message: { type: Schema.Types.ObjectId, ref: 'CourseMessage', default: null},
});

module.exports = model('CourseAccess', CourseAccess);
