const {Schema, model} = require('mongoose')

const Course = new Schema({
    name: {type: String},
    course_code: {type: String},
    teacher_id: {type: String},
    student_ids: [{type: String}],
    material_ids: [{type: String}]
})

module.exports = model('Course', Course)