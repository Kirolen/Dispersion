const { Schema, model } = require('mongoose');

const EnrollmentCourse = new Schema({
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    student_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = model('EnrollmentCourse', EnrollmentCourse);
