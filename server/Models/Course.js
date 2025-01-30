const {Schema, model} = require('mongoose')

const Course = new Schema({
    course_name: {type: String, required: true},
    course_desc: {type: String, required: true},
    material_ids: [{type: String}]
})

module.exports = model('Course', Course)