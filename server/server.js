const express = require('express')
const mongoose = require('mongoose')
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes')
const messageRoutes = require('./routes/messageRoutes')
const cors = require('cors');
const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("", courseRoutes)
app.use("", messageRoutes)

let courseSockets = {};

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('joinCourse', (courseId) => {
        if (!courseSockets[courseId]) {
            courseSockets[courseId] = [];
        }
        courseSockets[courseId].push(socket.id);
        console.log(`User joined course: ${courseId}`);
    });

    socket.on('leaveCourse', (courseId) => {
        if (courseSockets[courseId]) {
            const index = courseSockets[courseId].indexOf(socket.id);
            if (index !== -1) {
                courseSockets[courseId].splice(index, 1);
            }
        }
        console.log(`User left course: ${courseId}`);
    });

    socket.on('sendMessage', (courseId, message) => {
        console.log(`New message in course ${courseId}:`, message);
        if (courseSockets[courseId]) {
            courseSockets[courseId].forEach((socketId) => {
                io.to(socketId).emit('newMessage', message);
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const start = async () => {
    try {
        await mongoose.connect("mongodb+srv://kostik:kostik@dispersioncluster.fy1nx.mongodb.net/?retryWrites=true&w=majority&appName=DispersionCluster")
        app.listen(PORT, () => console.log(`servers started on port ${PORT}`))
    }
    catch(error){
        console.log(error)
    }
}

start()