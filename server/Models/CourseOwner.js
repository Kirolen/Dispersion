const { Schema, model } = require('mongoose');

const CourseOwner = new Schema({
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    teacher_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = model('CourseOwner', CourseOwner);
