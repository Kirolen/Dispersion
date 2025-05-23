const User = require('../Models/User');
const Chat = require("../Models/Chat");
const Message = require("../Models/Message")
const Course = require('../Models/Course');
const CourseAccess = require('../Models/CourseAccess');
const CourseOwner = require('../Models/CourseOwner')

/**
 * @class ChatController
 * @classdesc Facilitates chat functionality between users (students, teachers) within courses.
 *
 * ### Features:
 * - Create and fetch messages in chat rooms.
 * - Handle room creation, message history, and participant data.
 * - Used for in-course communication.
 *
 * @exports ChatController
 */
class ChatController {
    /**
     * Searches for users by keyword excluding the current user.
     * Returns users matching the keyword in first name, last name, or email,
     * along with a flag indicating if a chat with the current user already exists.
     *
     * @param {import('express').Request} req - Express request object, expects req.user.id and req.params.keyWord.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async searchUsers(req, res) {
        try {
            const { keyWord } = req.params;
            const userId = req.user.id;
            if (!keyWord) {
                return res.status(400).json({ message: 'KeyWord is required' });
            }

            const users = await User.find({
                _id: { $ne: userId },
                $or: [
                    { first_name: { $regex: keyWord, $options: 'i' } },
                    { last_name: { $regex: keyWord, $options: 'i' } },
                    { email: { $regex: `^${keyWord}[^@]*@`, $options: 'i' } }
                ]
            }).select("first_name last_name email _id");

            const usersWithChatStatus = await Promise.all(users.map(async (user) => {
                const existingChat = await Chat.findOne({
                    isGroup: false,
                    members: { $all: [userId, user._id] }
                });

                return {
                    ...user.toObject(),
                    hasChat: !!existingChat
                };
            }));

            res.json({ users: usersWithChatStatus });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    }

    /**
    * Creates a one-on-one chat between two users if it does not already exist.
    *
    * @param {import('express').Request} req - Express request object, expects req.body.user1 and req.body.user2.
    * @param {import('express').Response} res - Express response object.
    * @returns {Promise<void>}
    */
    async createChat(req, res) {
        try {
            const { user1, user2 } = req.body;

            let existingChat = await Chat.findOne({
                members: { $all: [user1, user2] },
                isGroup: false
            });

            if (existingChat) {
                return res.status(200).json({ success: true, message: "Chat already exists", chat: existingChat });
            }

            const newChat = new Chat({
                members: [user1, user2],
                createdBy: user1,
                isActiveFor: [user1]
            });

            await newChat.save();

            const populatedNewChat = await newChat
                .populate("members", "first_name last_name email")

            res.status(201).json({ success: true, chat: populatedNewChat });
        } catch (error) {
            res.status(500).json({ message: "Error creating chat", error });
        }
    }

    /**
     * Retrieves all active chats for the current user that are not course chats.
     *
     * @param {import('express').Request} req - Express request object, expects req.user.id.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>}
     */
    async getUserChats(req, res) {
        try {
            const userId = req.user.id;

            const chats = await Chat.find({
                members: userId,
                isActiveFor: userId,
                isCourseChat: null
            }).populate("members", "first_name last_name email avatar")
                .populate("lastMessage");

            res.json({ success: true, chats });
        } catch (error) {
            res.status(500).json({ message: "Error fetching user chats", error });
        }
    }

    /**
    * Retrieves a specific chat by ID for the current user, including members and the last message.
    *
    * @param {import('express').Request} req - Express request object, expects req.user.id and req.params.chatId.
    * @param {import('express').Response} res - Express response object.
    * @returns {Promise<void>}
    */
    async getChat(req, res) {
        try {
            const userId = req.user.id;
            const { chatId } = req.params;

            const chat = await Chat.findOne({
                _id: chatId,
                members: userId,
            }).populate("members").populate("lastMessage");

            if (!chat) {
                return res.status(404).json({ success: false, message: "Chat not found" });
            }

            res.json({ success: true, chat });
        } catch (error) {
            res.status(500).json({ message: "Error fetching user chats", error });
        }
    }

    /**
     * Adds a new message to a chat.
     *
     * @param {string} chatId - The ID of the chat to which the message belongs.
     * @param {string} sender - The ID of the user sending the message.
     * @param {string} text - The text content of the message.
     * @param {Array} [attachments] - Optional array of attachments associated with the message.
     * @returns {Promise<Object|null>} Returns the newly created message object with populated sender data,
     * formatted created_at timestamp, or null if chat not found or an error occurs.
     */
    async addMessage(chatId, sender, text, attachments) {
        try {
            const chat = await Chat.findById(chatId).lean();
            if (!chat) {
                console.log("Chat not found or sender not a member");
                return null;
            }

            const newMessage = await Message.create({
                chatId,
                sender,
                text,
                attachments: attachments || [],
                seenBy: [{ userId: sender, timestamp: new Date() }]
            });

            await Chat.updateOne(
                { _id: chatId },
                {
                    $set: { lastMessage: newMessage._id, isActiveFor: chat.members },
                    $push: { messages: newMessage._id }
                }
            );

            const populatedMessage = await newMessage.populate({
                path: "sender",
                select: "_id first_name last_name avatar"
            });

            return {
                chatId,
                id: populatedMessage._id,
                text: populatedMessage.text,
                created_at: populatedMessage.createdAt.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).replace(/\//g, '.'),
                author: `${populatedMessage.sender.first_name} ${populatedMessage.sender.last_name}`,
                sender: populatedMessage.sender,
                attachments: populatedMessage.attachments
            };
        } catch (error) {
            console.error("Error adding message:", error);
            return null;
        }
    }

    /**
     * Retrieves messages from a chat and marks unseen messages as seen by the user.
    * Also updates course read status if chat is associated with a course.
    *
    * @param {string} chatId - The ID of the chat to fetch messages from.
    * @param {string} user_id - The ID of the user requesting messages.
    * @param {string} [course_id] - Optional course ID if the chat is a course chat.
    * @returns {Promise<Array>} Returns an array of message objects with sender populated and formatted dates.
    */
    async getMessages(chatId, user_id, course_id) {
        try {
            const user = await User.findById(user_id);

            const chat = await Chat.findById(chatId)
                .populate({
                    path: "messages",
                    populate: {
                        path: "sender",
                        select: "_id first_name last_name avatar"
                    }
                })
                .lean();

            if (!chat) {
                return [];
            }

            const messagesToUpdate = chat.messages.filter(message =>
                !message.seenBy.some(userSeen => userSeen.userId.toString() === user_id.toString())
            );

            if (messagesToUpdate.length > 0) {
                await Message.updateMany(
                    { _id: { $in: messagesToUpdate.map(m => m._id) } },
                    { $addToSet: { seenBy: { userId: user_id, timestamp: new Date() } } }
                );
            }

            if (chat.isCourseChat && course_id) {
                const lastMessageId = chat.lastMessage;

                if (lastMessageId) {
                    const updateQuery = { last_read_message: lastMessageId };

                    if (user.role === "Student") {
                        await CourseAccess.updateOne({ course_id, student_id: user_id }, updateQuery, { upsert: true });
                    } else if (user.role === "Teacher") {
                        await CourseOwner.updateOne({ course_id, teacher_id: user_id }, updateQuery, { upsert: true });
                    }
                }
            }

            return chat.messages.map(message => ({
                id: message._id,
                text: message.text,
                created_at: new Date(message.createdAt).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).replace(/\//g, '.'),
                author: `${message.sender.first_name} ${message.sender.last_name}`,
                sender: message.sender,
                attachments: message.attachments
            }));

        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    }

    /**
    * Finds all unread chats and course chats for the authenticated user.
    * 
    * For students and teachers, it checks course chats for unread messages based on last read message tracking.
    * It also checks regular (non-course) chats for unread messages by verifying if the user has seen the last message.
    * 
    * @param {Object} req - Express request object, expects `req.user.id` with authenticated user ID.
    * @param {Object} res - Express response object.
    * @returns {Promise<void>} Responds with a JSON object containing arrays of unread course chat IDs and unread regular chat IDs.
    */
    async findUnreadChats(req, res) {
        const user = req.user
        const userExists = await User.findById(user.id);
        if (!userExists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let coursesWithUnreadMessages = [];

        if (userExists.role === "Student") {
            const studentCourses = await CourseAccess.find({ student_id: user.id }).select('course_id last_read_message');

            for (const courseAccess of studentCourses) {
                const { last_read_message } = courseAccess;
                const chat = await Chat.findOne({
                    isCourseChat: courseAccess.course_id
                })
                const lastMessage = chat.lastMessage

                if (lastMessage && lastMessage.toString() !== (last_read_message ? last_read_message.toString() : null)) {
                    coursesWithUnreadMessages.push(chat._id);
                }
            }

        } else if (userExists.role === "Teacher") {
            const teacherCourses = await CourseOwner.find({ teacher_id: user.id }).select('course_id last_read_message');
            for (const courseOwner of teacherCourses) {
                const { last_read_message } = courseOwner;
                const chat = await Chat.findOne({
                    isCourseChat: courseOwner.course_id
                })

                const lastMessage = chat.lastMessage

                if (lastMessage && lastMessage.toString() !== (last_read_message ? last_read_message.toString() : null)) {
                    coursesWithUnreadMessages.push(chat._id);
                }
            }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid user role' });
        }
        let unreadChats = [];

        const allChats = await Chat.find({ members: user.id, isCourseChat: null }).select('lastMessage');
        for (const chat of allChats) {
            const lastMessage = await Message.findById(chat.lastMessage).select('_id seenBy');
            let seenMessage = false
            lastMessage?.seenBy.forEach(user => {
                if (user.userId.toString() === userExists._id.toString()) seenMessage = true
            })
            if (!seenMessage && lastMessage) {
                unreadChats.push(chat._id);
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                unreadCourses: coursesWithUnreadMessages,
                unreadChats
            }
        });
    }

    /**
    * Marks the last message in a course chat as read by updating the course access or course owner record
    * or marks the last message in a regular chat as seen by the user.
    * 
    * @param {Object} req - Express request object with the body containing:
    *   - {string} chat_id - ID of the chat to update.
    *   - {string} user_id - ID of the user marking the message as read.
    *   - {string} [course_id] - Optional course ID if the chat is a course chat.
    * @param {Object} res - Express response object.
     * @returns {Promise<void>} Responds with success status and message or error details.
    */
    async markLastCourseMessageAsRead(req, res) {
        try {
            const { chat_id, user_id, course_id } = req.body;
            const userExists = await User.findById(user_id).lean();
            if (!userExists) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const chat = await Chat.findById(chat_id).select("lastMessage").lean()
            if (!chat) {
                return res.status(400).json({ success: true, message: 'Chat not find!' });
            }

            const lastMessage = await Message.findById(chat.lastMessage).select("_id seenBy").lean();

            if (!lastMessage) {
                return res.status(200).json({ success: true, message: 'No messages found in the course' });
            }

            if (course_id) {
                const courseExists = await Course.findById(course_id).lean();
                if (!courseExists) {
                    return res.status(404).json({ success: false, message: 'Course not found' });
                }

                const updateQuery = { last_read_message: lastMessage._id };

                if (userExists.role === "Student") {
                    await CourseAccess.updateOne({ course_id, student_id: user_id }, updateQuery, { upsert: true });
                } else if (userExists.role === "Teacher") {
                    await CourseOwner.updateOne({ course_id, teacher_id: user_id }, updateQuery, { upsert: true });
                } else {
                    return res.status(400).json({ success: false, message: 'Invalid user role' });
                }
            }
            else {
                const isAlreadySeen = lastMessage.seenBy.some(user => user.userId.toString() === user_id.toString());

                if (!isAlreadySeen) {
                    await Message.updateOne(
                        { _id: lastMessage._id },
                        { $push: { seenBy: { userId: user_id, timestamp: new Date() } } }
                    );
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Last message marked as read'
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }
}

module.exports = new ChatController();
