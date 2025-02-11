const express = require('express')
const mongoose = require('mongoose')
const http = require('http');
const authRoutes = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes')
const materialRoutes = require('./routes/materialRoutes')
const calendarEventRoutes = require('./routes/calendarEventRoutes')
const fileRoutes = require("./routes/fileRoutes")
const chatRoutes = require("./routes/chatRoutes")
const jwt = require('jsonwebtoken')
const cors = require('cors');
const PORT = process.env.PORT || 5000
const { secret } = require('./Config/config')
const {getMessagess, addMessage} = require('./Controllers/chatController')
const app = express()
const server = http.createServer(app);
const User = require("./Models/User");
const Course = require('./Models/Course')
const Message = require('./Models/Message')

const Chat = require('./Models/Chat')
const path = require('path');

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("", courseRoutes)
app.use("/material", materialRoutes)
app.use("/calendar", calendarEventRoutes)

app.use("/file", fileRoutes)
app.use("/chat", chatRoutes)

app.use('/storage', express.static(path.join(__dirname, 'storage')));
mongoose.connect("mongodb+srv://kostik:kostik@dispersioncluster.fy1nx.mongodb.net/?retryWrites=true&w=majority&appName=DispersionCluster")

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.use((socket, next) => {
    const token = socket.handshake.query.token;
    console.log(`🔑 Incoming auth token: ${token}`);

    if (!token) {
        console.log("❌ No token provided");
        return next(new Error("Authentication error"));
    }

    try {
        const decodedData = jwt.verify(token, secret);
        socket.userId = decodedData.id;
        console.log(`✅ Authenticated user ID: ${socket.userId}`);
        next();
    } catch (err) {
        console.log("❌ Invalid token:", err.message);
        return next(new Error("Authentication error"));
    }
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log(`🟢 New WebSocket connection: ${socket.id}`);
    onlineUsers.set(socket.userId, socket.id);
    console.log(onlineUsers)

    socket.on("disconnect", (reason) => {
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
        console.log(`🔴 WebSocket disconnected: ${socket.id} (${reason})`);
    });

    socket.on("joinCourseChat", async ({ courseId }) => {
        socket.join(courseId);
        console.log("A user joined chatroom: " + courseId);

        try {
            console.log("getting...")
            const messages = await getMessagess(null, courseId)
   
            console.log(messages)
            socket.emit("getMessages", messages);
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    });

    socket.on("leaveCourseChat", ({ courseId }) => {
        socket.leave(courseId);
        console.log("A user left chatroom: " + courseId);
    });

    socket.on("joinChat", ({ userId, chatId }) => {
        socket.join(chatId);
        console.log(`👤 User ${userId} joined chat ${chatId}`);
    });

    socket.on("sendMessage", async ({ chatId, sender, text, attachments }) => {
        console.log("Message: " + text)
        try {
            const newMessage = new Message({
                chatId,
                sender,
                text,
                attachments: attachments || [],
                seenBy: [{ userId: sender, timestamp: new Date() }]
            });

            await newMessage.save();

            await Chat.findByIdAndUpdate(chatId, {
                lastMessage: newMessage._id,
                $push: { messages: newMessage._id }
            });

            io.to(chatId).emit("newMessage", newMessage);
            console.log("📩 Message sent:", newMessage);
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    });

    socket.on("chatroomMessage", async ({ courseId, user_id, messageText }) => {
        console.log(messageText)
        if (messageText?.trim().length > 0) {
            try {
                const newMessage = await addMessage(null, user_id, messageText, [], courseId);
                const sender = await User.findById(user_id);
                const course = await Course.findById(courseId);

                const courseName = course ? course.course_name : "Unknown Course";

                const messageData = {
                    message: newMessage.text,
                    author: sender ? `${sender.first_name} ${sender.last_name}` : "Unknown",
                    created_at: newMessage.createdAt.toLocaleString(),
                    courseId: courseId,
                    courseName: courseName,
                };

                io.to(courseId).emit("newMessage", messageData);

                socket.broadcast.emit("newGlobalNotification", {
                    message: `New message in ${courseName}: ${newMessage.text}`,
                    courseId: courseId,
                    sender: sender ? `${sender.first_name} ${sender.last_name}` : "Unknown"
                });
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    });
});

process.on("SIGINT", () => {
    console.log("🛑 Shutting down server...");
    io.close(() => {
        console.log("✅ WebSocket server closed");
        process.exit(0);
    });
});

const start = async () => {
    try {
        server.listen(PORT, () => console.log(`servers started on port ${PORT}`))
    }
    catch (error) {
        console.log(error)
    }
}

start()