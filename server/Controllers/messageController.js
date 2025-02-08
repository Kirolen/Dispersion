const Course = require('../Models/Course');
const CourseMessage = require('../Models/CourseMessage');
const User = require('../Models/User');
const CourseAccess = require('../Models/CourseAccess');
const CourseOwner = require('../Models/CourseOwner')

class messageController {
    async addMessage(course_id, sender_id, message) {
        try {
            const courseExists = await Course.findById(course_id);
            if (!courseExists) {
                console.log("❌ Course not found");
                return null;
            }

            const newMessage = new CourseMessage({
                course_id,
                sender_id,
                message,
                created_at: new Date(),
            });

            await newMessage.save();
            return newMessage;
        } catch (error) {
            console.error("❌ Error adding message:", error);
            throw error;
        }
    }

    async getMessages(course_id) {
        try {
            const courseExists = await Course.findById(course_id);
            if (!courseExists) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            const messages = await CourseMessage.find({ course_id })
                .populate('sender_id', 'first_name last_name')
                .sort({ created_at: 1 });

            const transformedMessages = messages.map(message => {
                const formattedDate = new Date(message.created_at).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).replaceAll('/', '.');

                return {
                    message: message.message,
                    created_at: formattedDate,
                    author: `${message.sender_id.first_name} ${message.sender_id.last_name}`
                };
            });

            return transformedMessages;
        } catch (error) {
            return console.log('Error fetching messages', error);
        }
    }

    async markLastCourseMessageAsRead(req, res) {
        try {
            const { user_id, course_id } = req.body;

            const userExists = await User.findById(user_id);
            if (!userExists) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            const courseExists = await Course.findById(course_id);
            if (!courseExists) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
    
          
            const lastMessage = await CourseMessage.findOne({ course_id })
                .sort({ created_at: -1 })
                .select('_id created_at');
                console.log(user_id, course_id)
                console.log("lastMessage")
            if (!lastMessage) {
                return res.status(200).json({ success: true, message: 'No messages found in the course' });
            }
            console.log("after last message")
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
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }
    
    async findCoursesWithUnreadMessages(req, res) {
        try {
            const { user_id } = req.params; // ❗ Виправлено req.param → req.params
    
            // Перевірка, чи існує користувач
            const userExists = await User.findById(user_id);
            if (!userExists) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            
            let coursesWithUnreadMessages = [];
    
            if (userExists.role === "Student") {
                // Знаходимо всі курси, до яких студент має доступ
                const studentCourses = await CourseAccess.find({ student_id: user_id }).select('course_id last_read_message');
    
                for (const courseAccess of studentCourses) {
                    const { course_id, last_read_message } = courseAccess;
    
                    // Знаходимо останнє повідомлення в цьому курсі
                    const lastMessage = await CourseMessage.findOne({ course_id })
                        .sort({ created_at: -1 })
                        .select('_id created_at');
    
                    if (lastMessage && lastMessage._id.toString() !== (last_read_message ? last_read_message.toString() : null)) {
                        coursesWithUnreadMessages.push(course_id);
                    }
                }
    
            } else if (userExists.role === "Teacher") {
                // Знаходимо всі курси, до яких викладач має доступ
                const teacherCourses = await CourseOwner.find({ teacher_id: user_id }).select('course_id last_read_message');
    
                for (const courseOwner of teacherCourses) {
                    const { course_id, last_read_message } = courseOwner;
    
                    // Знаходимо останнє повідомлення в цьому курсі
                    const lastMessage = await CourseMessage.findOne({ course_id })
                        .sort({ created_at: -1 })
                        .select('_id created_at');
    
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
    

}

module.exports = new messageController();