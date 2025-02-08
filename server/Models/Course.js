const {Schema, model} = require('mongoose')

const Course = new Schema({
    course_name: {type: String, required: true},
    course_desc: {type: String, required: true}
})

module.exports = model('Course', Course)