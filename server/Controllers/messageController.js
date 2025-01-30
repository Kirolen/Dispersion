
const jwt = require('jsonwebtoken')

const Course = require('../Models/Course');
const Message = require('../Models/Message')
const {secret} = require('../Config/config')

class messageController {
    async addMessage(req, res) {
        try {
            const { course_id, message } = req.body;
            const token = req.headers['authorization']?.split(' ')[1];
    
            if (!token) {
                return res.status(400).json({ success: false, message: 'Token not provided' });
            }
    
            const decoded = jwt.verify(token, secret);
            const sender_id = decoded.id;
    
            const courseExists = await Course.findById(course_id);
            if (!courseExists) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
    
            const newMessage = new Message({
                course_id,
                sender_id,
                message,
                created_at: new Date(),
            });
    
            await newMessage.save();
    
            return res.json({ success: true, message: 'Message added successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Error adding message', error });
        }
    }
    
    async getMessages(req, res) {
        try {
            const { course_id } = req.params;
    
            const courseExists = await Course.findById(course_id);
            if (!courseExists) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
    
            const messages = await Message.find({ course_id })
                .populate('sender_id', 'first_name last_name')  // Populate first_name and last_name
                .sort({ created_at: 1 });
    
            // Transform the messages to return 'message', 'created_at' in readable format, and 'author'
            const transformedMessages = messages.map(message => {
                // Format the created_at timestamp into a more human-readable format
                const formattedDate = new Date(message.created_at).toLocaleString('en-US', {
                    weekday: 'long', // 'Monday'
                    year: 'numeric', // '2025'
                    month: 'long',   // 'January'
                    day: 'numeric',  // '30'
                    hour: 'numeric', // '10'
                    minute: 'numeric', // '31'
                    second: 'numeric', // '44'
                    hour12: true      // 'AM/PM'
                });
    
                return {
                    message: message.message, // Include the actual message
                    created_at: formattedDate, // Use the formatted date
                    author: `${message.sender_id.first_name} ${message.sender_id.last_name}` // Combine first_name and last_name into author
                };
            });
    
            return res.json({ success: true, data: transformedMessages });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Error fetching messages', error });
        }
    }
}

module.exports = new messageController();