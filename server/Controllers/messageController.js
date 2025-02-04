
const jwt = require('jsonwebtoken')

const Course = require('../Models/Course');
const Message = require('../Models/Message')
const {secret} = require('../Config/config')

class messageController {
    async addMessage(course_id, sender_id, message) {
        try {
            const courseExists = await Course.findById(course_id);
            if (!courseExists) {
                console.log("❌ Course not found");
                return null;
            }
    
            const newMessage = new Message({
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
    
            const messages = await Message.find({ course_id })
                .populate('sender_id', 'first_name last_name')  
                .sort({ created_at: 1 });
    
            const transformedMessages = messages.map(message => {
                const formattedDate = new Date(message.created_at).toLocaleString('en-US', {
                    weekday: 'long', 
                    year: 'numeric',
                    month: 'long',   
                    day: 'numeric', 
                    hour: 'numeric', 
                    minute: 'numeric', 
                    second: 'numeric', 
                    hour12: true    
                });
    
                return {
                    message: message.message, 
                    created_at: formattedDate, 
                    author: `${message.sender_id.first_name} ${message.sender_id.last_name}`
                };
            });
    
            return transformedMessages;
        } catch (error) {
            return console.log('Error fetching messages', error );
        }
    }
}

module.exports = new messageController();