const { Schema, model } = require('mongoose');

/**
 * @typedef {Object} Attachment
 * @property {string} filename - The name of the attached file.
 * @property {string} url - The URL to access the file.
 * @property {string} [type] - The type of the file (e.g., mime-type).
 */

/**
 * @typedef {Object} SeenByEntry
 * @property {import('mongoose').Types.ObjectId} userId - The ID of the user who has seen the message.
 * @property {Date} timestamp - The time when the message was seen.
 */

/**
 * @typedef {Object} Message
 * @property {import('mongoose').Types.ObjectId} chatId - The ID of the chat to which the message belongs.
 * @property {import('mongoose').Types.ObjectId} sender - The ID of the user who sent the message.
 * @property {string} [text] - The text content of the message.
 * @property {Attachment[]} [attachments] - Array of attached files.
 * @property {SeenByEntry[]} seenBy - List of users who have seen the message along with the timestamp.
 * @property {Date} createdAt - The date when the message was created.
 */

/**
 * Message Schema
 * 
 * Represents messages within chats.
 * 
 * Features:
 * - A message can contain text and/or attachments.
 * - Tracks which users have seen the message and when.
 * - Linked to a specific chat and sender.
 */
const MessageSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true }, 
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    text: { type: String}, 
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

/**
 * Mongoose model for the `Message` collection.
 */
module.exports = model('Message', MessageSchema);
