const User = require('../Models/User');
const Chat = require("../Models/Chat");
const Message = require("../Models/Message")

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
                isActiveFor: userId 
            })
            .populate("members", "first_name last_name email") 
            .populate("lastMessage"); 

            res.json({ success: true, chats });
        } catch (error) {
            res.status(500).json({ message: "Error fetching user chats", error });
        }
    }

    async getChat(req, res) {
        try {
            const userId = req.user.id; 
            const {chatId} = req.params;

            const chat = await Chat.findOne({
                _id: chatId,
                members: userId
            })
            .populate("members") 
            .populate("lastMessage"); 
    
            if (!chat) {
                return res.status(404).json({ success: false, message: "Chat not found" });
            }
    
            res.json({ success: true, chat });
        } catch (error) {
            res.status(500).json({ message: "Error fetching user chats", error });
        }
    }

    async sendMessage(req, res) {
        try {
            const userId = req.user.id; 
            const {chatId, text, attachments} = req.body;

            const chat = await Chat.findOne({
                _id: chatId,
                members: userId
            })
            const newMessage = new Message({
                chatId,
                sender: userId,
                text,
                attachments: attachments || [],
                seenBy: [{ userId, timestamp: new Date() }] 
            });
    
            await newMessage.save();
    
            chat.lastMessage = newMessage._id;
            chat.messages.push(newMessage._id)
            await chat.save();
            
            res.json({ success: true, data: {chat, newMessage} });
        } catch (error) {
            res.status(500).json({ message: "Error fetching user chats", error });
        }
    }

    async getMessages(req, res) {
        try {
            const { chatId } = req.params;
            const userId = req.user.id;
            const chat = await Chat.findOne({
                _id: chatId,
                members: userId
            }).populate("messages");
            

            if (!chat) {
                return res.status(404).json({ success: false, message: "Chat not found" });
            }
            chat.isActiveFor = chat.members
            chat.save()
            return res.json({ success: true, messages: chat.messages });
        } catch (error) {
            console.error("Error fetching messages:", error);
            return res.status(500).json({ message: "Error fetching messages", error });
        }
    }
}

module.exports = new ChatController();
