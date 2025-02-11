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
            const chat = await Chat.findOne({
                _id: chatId,
                members: sender
            });
    
            if (!chat) {
                console.log("Chat not found or sender not a member");
                return null;
            }
    
            const newMessage = new Message({
                chatId: chat._id,
                sender: sender,
                text,
                attachments: attachments || [],
                seenBy: [{ userId: sender, timestamp: new Date() }]
            });
    
            await newMessage.save();
    
            chat.lastMessage = newMessage._id;
            chat.messages.push(newMessage._id);
            await chat.save();
    
            const populatedMessage = await Message.findById(newMessage._id)
                .populate({
                    path: "sender",
                    select: "_id first_name last_name"
                });
    
            const createdAt = new Date(populatedMessage.createdAt);
            const formattedDate = createdAt
                .toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })
                .split('/')
                .join('.');
    
            const formattedMessage = {
                chatId: chatId,
                id: populatedMessage._id,
                text: populatedMessage.text,
                created_at: formattedDate,
                author: `${populatedMessage.sender.first_name} ${populatedMessage.sender.last_name}`,
                sender: populatedMessage.sender,
                attachments: populatedMessage.attachments
            };
    
            return formattedMessage;
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
                });
    
            if (!chat) {
                console.log("Chat not found");
                return [];
            }
    
            chat.isActiveFor = chat.members;
            await chat.save();
    
            const messagesToUpdate = chat.messages.filter(message => {
                return !message.seenBy.some(userSeen => userSeen.userId.toString() === user_id.toString());
            });
    
            if (messagesToUpdate.length > 0) {
                await Message.updateMany(
                    { _id: { $in: messagesToUpdate.map(m => m._id) } }, 
                    { $push: { seenBy: { userId: user_id, timestamp: new Date() } } }
                );
            }
    
            if (chat.isCourseChat && course_id) {
                const lastMessage = await Message.findOne({ chatId: chat._id })
                    .sort({ createdAt: -1 })
                    .select('_id createdAt');
    
                console.log("Last message: ", lastMessage);
    
                if (user.role === "Student") {
                    const studentCourse = await CourseAccess.findOne({ course_id, student_id: user_id });
                    if (studentCourse) {
                        studentCourse.last_read_message = lastMessage._id;
                        await studentCourse.save();
                    }
                }
    
                if (user.role === "Teacher") {
                    const teacherCourse = await CourseOwner.findOne({ course_id, teacher_id: user_id });
                    if (teacherCourse) {
                        teacherCourse.last_read_message = lastMessage._id;
                        await teacherCourse.save();
                    }
                }
            }
    
            const transformedMessages = chat.messages.map(message => {
                const createdAt = new Date(message.createdAt);
                const formattedDate = createdAt
                    .toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    })
                    .split('/')
                    .join('.');
    
                return {
                    id: message._id,
                    text: message.text,
                    created_at: formattedDate,
                    author: `${message.sender.first_name} ${message.sender.last_name}`,
                    sender: message.sender
                };
            });
    
            return transformedMessages;
    
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    }
    


    async findCoursesWithUnreadMessages(req, res) {
        try {
            const { user_id } = req.params;
            console.log("user: " + user_id)
            const userExists = await User.findById(user_id);
            if (!userExists) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            let coursesWithUnreadMessages = [];

            if (userExists.role === "Student") {
                const studentCourses = await CourseAccess.find({ student_id: user_id }).select('course_id last_read_message');

                for (const courseAccess of studentCourses) {
                    const { course_id, last_read_message } = courseAccess;
                    const chat = await Chat.findOne({
                        isCourseChat: courseAccess.course_id
                    })
                    const lastMessage = await Message.findOne({ chatId: chat._id })
                        .sort({ createdAt: -1 })
                        .select('_id createdAt');

                    if (lastMessage && lastMessage._id.toString() !== (last_read_message ? last_read_message.toString() : null)) {
                        coursesWithUnreadMessages.push(course_id);
                    }
                }

            } else if (userExists.role === "Teacher") {

                const teacherCourses = await CourseOwner.find({ teacher_id: user_id }).select('course_id last_read_message');
                for (const courseOwner of teacherCourses) {
                    const { course_id, last_read_message } = courseOwner;
                    const chat = await Chat.findOne({
                        isCourseChat: courseOwner.course_id
                    })

                    const lastMessage = await Message.findOne({ chatId: chat._id })
                        .sort({ createdAt: -1 })
                        .select('_id createdAt');
           

                    if (lastMessage && lastMessage._id.toString() !== (last_read_message ? last_read_message.toString() : null)) {
                        coursesWithUnreadMessages.push(course_id);
                    }
                }
            } else {
                return res.status(400).json({ success: false, message: 'Invalid user role' });
            }

            return res.status(200).json({
                success: true,
                unreadCourses: coursesWithUnreadMessages
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }

    async markLastCourseMessageAsRead(req, res) {
        try {
            const { user_id, course_id, chat_id } = req.body;
            const userExists = await User.findById(user_id);
            if (!userExists) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            if (course_id) {
                const courseExists = await Course.findById(course_id);
                if (!courseExists) {
                    return res.status(404).json({ success: false, message: 'Course not found' });
                }

                const chat = await Chat.findOne({
                    isCourseChat: course_id
                })

                const lastMessage = await Message.findOne({ chatId: chat._id })
                    .sort({ createdAt: -1 })
                    .select('_id createdAt');

                if (!lastMessage) {
                    return res.status(200).json({ success: true, message: 'No messages found in the course' });
                }

                let updatedLastReadMessage;
                if (userExists.role === "Student") {
                    const updatedCourseAccess = await CourseAccess.findOneAndUpdate(
                        { course_id, student_id: user_id },
                        { last_read_message: lastMessage._id },
                        { new: true, upsert: true }
                    ).select('last_read_message');

                    updatedLastReadMessage = updatedCourseAccess.last_read_message;

                } else if (userExists.role === "Teacher") {
                    const updatedCourseOwner = await CourseOwner.findOneAndUpdate(
                        { course_id, teacher_id: user_id },
                        { last_read_message: lastMessage._id },
                        { new: true, upsert: true }
                    ).select('last_read_message');

                    console.log("last message: ")
                    console.log(updatedCourseOwner.last_read_message._id)
                    updatedLastReadMessage = updatedCourseOwner.last_read_message;
                } else {
                    return res.status(400).json({ success: false, message: 'Invalid user role' });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Last message marked as read',
                    lastMessage,
                    updatedLastReadMessage
                });

            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }

}

module.exports = new ChatController();
