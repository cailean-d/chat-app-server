module.exports = function(io){

    let users = {};

    io.on('connection', function(socket){

        users[socket.handshake.query.id] = socket;

        socket.on('disconnect', () => {
            delete users[socket.handshake.query.id];
            // socket.leave(room);
        });

        socket.on('room', function(room) {
            socket.join(room);
        });

        socket.on('room_message', (data) => {
            let res = JSON.parse(data);
            socket.broadcast.to(res.chat_id).emit('room_message', data);
        });

    });


}
    