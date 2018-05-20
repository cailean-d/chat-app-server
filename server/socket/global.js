let users = {};

module.exports = function(io){

    io.on('connection', function(socket){

        users[socket.handshake.query.id] = socket;

        socket.on('disconnect', () => {
            delete users[socket.handshake.query.id];
        });

        chatSocket(socket);
        friendSocket(socket);
        userOnline(socket);

    });

}

function chatSocket(socket) {

    socket.on('room', function(room) {
        socket.join(room);
    });

    socket.on('room_message', (data) => {
        let res = JSON.parse(data);
        socket.broadcast.to(res.chat_id).emit('room_message', data);
    });

}

function friendSocket(socket) {

    socket.on('invite', (data) => {
    
        let d = JSON.parse(data);

        if (users[d.id]) users[d.id].emit('invited', JSON.stringify(d.user));

    });

    socket.on('cancel_invite', (data) => {

        let d = JSON.parse(data);

        if (users[d.id]) users[d.id].emit('invite_canceled', JSON.stringify(d.user));

    })

    socket.on('reject_invite', (data) => {

        let d = JSON.parse(data);

        if (users[d.id]) users[d.id].emit('invite_rejected', JSON.stringify(d.user));

    })

    socket.on('add_friend', (data) => {

        let d = JSON.parse(data);

        if (users[d.id]) users[d.id].emit('friend_added', JSON.stringify(d.user));

    })

    socket.on('del_friend', (data) => {

        let d = JSON.parse(data);

        if (users[d.id]) users[d.id].emit('friend_deleted', JSON.stringify(d.user));

    })

}
    

function userOnline(socket) {

    socket.broadcast.emit('online', socket.handshake.query.id);

    socket.on('disconnect', () => {
        let id = socket.handshake.query.id;
        setTimeout(() => {
            if (!users[id]) {
                socket.broadcast.emit('offline', socket.handshake.query.id);
            }
        }, 10000);
    });

    socket.on('get_online', (data) => {

        if (users[data]) {
            socket.emit('is_online', JSON.stringify({id: data, result: true}));
        } else {
            socket.emit('is_online', JSON.stringify({id: data, result: false}));
        }

    })

}