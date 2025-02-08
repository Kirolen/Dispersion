const {Schema, model} = require('mongoose')

const CourseMessage = new Schema({
    course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: {type: String, required: true}, 
    created_at: { type: Date, default: Date.now } 
})

module.exports = model('CourseMessage', CourseMessage)