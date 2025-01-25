const {Schema, model} = require('mongoose')

const User = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: { type: String, enum: ['Student', 'Teacher'], required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }] 
})

module.exports = model('User', User)