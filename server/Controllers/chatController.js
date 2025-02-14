const User = require('../Models/User');
const Chat = require("../Models/Chat");
const Message = require("../Models/Message")
const Course = require('../Models/Course');
const CourseAccess = require('../Models/CourseAccess');
const CourseOwner = require('../Models/CourseOwner')


class ChatController {
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

    async createChat(req, res) {
        try {
            const { user1, user2 } = req.body;

            let existingChat = await Chat.findOne({
                members: { $all: [user1, user2] },
                isGroup: false
            });

            console.log(existingChat)

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

    async getUserChats(req, res) {
        try {
            const userId = req.user.id;

            const chats = await Chat.find({
                members: userId,
                isActiveFor: userId,
                isCourseChat: null
            }).populate("members", "first_name last_name email")
                .populate("lastMessage");

            res.json({ success: true, chats });
        } catch (error) {
            res.status(500).json({ message: "Error fetching user chats", error });
        }
    }

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

    //add last message if course
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
                select: "_id first_name last_name"
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


    async getMessages(chatId, user_id, course_id) {
        try {
            const user = await User.findById(user_id);

            const chat = await Chat.findById(chatId)
                .populate({
                    path: "messages",
                    populate: {
                        path: "sender",
                        select: "_id first_name last_name"
                    }
                })
                .lean();

            if (!chat) {
                console.log("Chat not found");
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
                const { course_id, last_read_message } = courseAccess;
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
                const { course_id, last_read_message } = courseOwner;
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
