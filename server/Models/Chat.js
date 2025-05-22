const { Schema, model } = require('mongoose');

/**
 * @typedef {Object} Chat
 * @property {Schema.Types.ObjectId[]} members - Array of user IDs who are members of the chat.
 * @property {boolean} isGroup - Indicates whether the chat is a group chat or a one-on-one chat.
 * @property {Schema.Types.ObjectId|null} isCourseChat - If the chat is tied to a course, this is the course ID.
 * @property {string|null} groupName - Name of the group chat (null for personal chats).
 * @property {Schema.Types.ObjectId[]} messages - Array of message IDs in this chat.
 * @property {Schema.Types.ObjectId} lastMessage - Reference to the most recent message.
 * @property {Schema.Types.ObjectId} createdBy - ID of the user who created the chat.
 * @property {Schema.Types.ObjectId[]} isActiveFor - List of users for whom the chat is currently active.
 * @property {Date} createdAt - Timestamp of when the chat was created.
 * @property {Date} updatedAt - Timestamp of the last update to the chat.
 */

/**
 * Chat Schema
 * 
 * This schema represents a chat session, either one-on-one or a group.
 * It supports course-related group chats, tracks messages, and stores metadata.
 * 
 * Features:
 * - Distinguishes between personal, group, and course-specific chats
 * - Stores references to members, messages, and the last message
 * - Tracks which users currently have the chat active
 * - Automatically records creation and update timestamps
 */
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

/**
 * Chat model for managing user and group messaging functionality.
 */
module.exports = model('Chat', ChatSchema);
