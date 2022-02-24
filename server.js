const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const formateMessage = require('./untils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomsUsers } = require('./untils/users');
const app = express();
const server = require('http').createServer(app);
const io = socketio(server);
const botName = 'ChatCord Bot';

// handle the event sent with socket.emit()
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room}) => {
        const user = userJoin(socket.id, username, room);
        
        socket.join(user.room);

        // this emit is single user
        // Welcome to current user
        socket.emit('message', formateMessage(botName, 'Welcome-Chat-Cord'));

        //emit broadcast is everybody except that connecting

        // broadcast when user connect
        socket.broadcast.to(user.room).emit('message', formateMessage(botName, `${user.username} has joined the chat `));

        //send users and rooms info
        io.to(user.room).emit('roomsUser', {
            room: user.room,
            users: getRoomsUsers(user.room)
        });
    });
    // all client
    // io.emit();

    // listen for chatMessage
    socket.on('chatMessage', msg => {
        // console.log(msg);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formateMessage(user.username, msg));
    });

    // run when user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formateMessage(botName, `${user.username} has left the chat`));

            //send users and rooms info
            io.to(user.room).emit('roomsUser', {
                room: user.room,
                users: getRoomsUsers(user.room)
            });
        }
    });

});
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running ${port}`);
})

