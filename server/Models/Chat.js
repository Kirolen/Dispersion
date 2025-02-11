const { Schema, model } = require('mongoose');

const ChatSchema = new Schema({
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }], 
    isGroup: { type: Boolean, default: false }, 
    isCourseChat: { type: Schema.Types.ObjectId, ref: 'Course', default: null }, 
    groupName: { type: String, default: null }, 
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }], 
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }, 
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    isActiveFor: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now } 
}, { timestamps: true });

module.exports = model('Chat', ChatSchema);
