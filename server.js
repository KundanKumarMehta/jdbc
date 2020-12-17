const express = require('express');
const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log("Listening on port: " + port);
});
var io = require('socket.io')(server);

users = [];
connections = [];
console.log(typeof users);

console.log('Server running...');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', function (data) {

        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send message', function (data) {
        io.sockets.emit('new message', { msg: data, user: socket.username });
    });

    //new user
    socket.on('new user', function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        console.log('get user in server.js');
        io.sockets.emit('get users', users);
    }
});