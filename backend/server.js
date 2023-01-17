const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
dotenv.config();
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(express.json());

app.use('/api/user', userRoute)
app.use('/api/chat', chatRoute)
app.use('/api/message', messageRoute)

app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.yellow.bold);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("connected to socket");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join room", (room) => {
        socket.join(room);
        console.log("joined room: " + room);
    })

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message received", newMessageRecieved);
        }
        )
    })

    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    })

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    })

    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})