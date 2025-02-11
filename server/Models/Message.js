const { Schema, model } = require('mongoose');

const MessageSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true }, 
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    text: { type: String, required: true }, 
    attachments: [{
        filename: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String } 
    }], 
    seenBy: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' }, 
        timestamp: { type: Date, default: Date.now } 
    }], 
    createdAt: { type: Date, default: Date.now } 
}, { timestamps: true });

module.exports = model('Message', MessageSchema);
