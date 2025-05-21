const express = require('express')
const mongoose = require('mongoose')
const http = require('http');
const authRoutes = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes')
const materialRoutes = require('./routes/materialRoutes')
const calendarEventRoutes = require('./routes/calendarEventRoutes')
const fileRoutes = require("./routes/fileRoutes")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const testRoutes = require('./routes/testRoutes')
const jwt = require('jsonwebtoken')
const cors = require('cors');
const PORT = process.env.PORT || 5000
const { secret } = require('./Config/config')
const {getMessages, addMessage} = require('./Controllers/chatController')
const app = express()
const server = http.createServer(app);
const path = require('path');
const Chat = require('./Models/Chat');

const logSocket = false;

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("", courseRoutes)
app.use("/material", materialRoutes)
app.use("/calendar", calendarEventRoutes)
app.use("/user", userRoutes)
app.use("/test", testRoutes)
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
    if (logSocket) console.log(`🔑 Incoming auth token: ${token}`);

    if (!token) {
        if (logSocket) console.log("❌ No token provided");
        return next(new Error("Authentication error"));
    }

    try {
        const decodedData = jwt.verify(token, secret);
        socket.userId = decodedData.id;
        if (logSocket) console.log(`✅ Authenticated user ID: ${socket.userId}`);
        next();
    } catch (err) {
        if (logSocket) console.log("❌ Invalid token:", err.message);
        return next(new Error("Authentication error"));
    }
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
    if (logSocket) console.log(`🟢 New WebSocket connection: ${socket.id}`);
    onlineUsers.set(socket.userId, socket.id);
    if (logSocket) console.log(onlineUsers)

    socket.on("disconnect", (reason) => {
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
        if (logSocket) console.log(`🔴 WebSocket disconnected: ${socket.id} (${reason})`);
    });

    socket.on("joinChat", async ({ chatId, user_id, course_id }) => {
        socket.join(chatId);
        console.log("A user joined chatroom: " + chatId);

        try {
            const messages = await getMessages(chatId, user_id, course_id)
   
            if (logSocket) console.log(messages)
            socket.emit("getMessages", messages);
        } catch (error) {
            console.error("Error loaing messages:", error);
        }
    });

    socket.on("leaveChat", ({ chatId }) => {
        socket.leave(chatId);
    });

    socket.on("sendMessage", async ({ chatId, sender, text, attachments }) => {
        try {
            console.log("send message")
            const newMessage = await addMessage(chatId, sender, text, attachments)
            console.log(newMessage)
            io.to(chatId).emit("newMessage", newMessage);

            const chatName = await Chat.findById(newMessage.chatId).select('groupName')

            console.log(chatName)
            socket.broadcast.emit("newGlobalNotification", {
                message: newMessage.text,
                name: chatName.groupName ? chatName.groupName.trim() : "personal chat",
                sender: newMessage.sender ? `${newMessage.sender.first_name} ${newMessage.sender.last_name}` : "Unknown"
            });
        } catch (error) {
            console.error("❌ Error sending message:", error);
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