require('dotenv').config();
const http = require('http');
const app = require('./app2');
const connectDB = require('./config/db');

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const { Server } = require('socket.io');
require('dotenv').config();
const http = require('http');

const io = new Server(server, {
    cors: {
        origin: `${process.env.FrontEnd}`,
        methods: ["GET", "POST"],
    },
});
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('message', (data) => {
        console.log('Received message:', data);
    });

    socket.on('sendMessage', (data) => {
        const { room, content } = data;
        console.log('sendMessage:', room, content);
        socket.broadcast.to(room).emit('sendMessage', content);
    });
    socket.on('sendComment', (data) => {
        const { room, content } = data;
        console.log('sendComment:', room, content,data);
        socket.broadcast.to(room).emit('sendComment', content);
    });
});
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
