const notification = require('../database/notification');

let users = {};

module.exports = function(io){

    io.on('connection', function(socket){

        users[socket.handshake.query.id] = socket;

        socket.on('disconnect', () => {
            delete users[socket.handshake.query.id];
        });

        let socketAPI = new Socket(socket);

    });

}



class Socket {

    constructor(socket) {
        this.socket = socket;
        this.chat();
        this.friend();
        this.online();
    }

    async sendNotification(id, message) {
        let notif = await notification.addNotification(id, message);
        if (users[id]) users[id].emit('notification', JSON.stringify(notif));
    }

    chat() {

        this.socket.on('room', (room) => {
    
            this.socket.join(room);
    
        });
    
        this.socket.on('room_message', (data) => {
    
            let res = JSON.parse(data);
            
            this.socket.broadcast.to(res.chat_id).emit('room_message', data);
    
        });
    
        this.socket.on('invite_room', (data) => {
    
            let d = JSON.parse(data);
            
            if (users[d.user_id]) users[d.user_id].emit('room_invited', JSON.stringify(d.chat_id));
    
        })

        this.socket.on('read_message', (data) => {
            let res = JSON.parse(data);
            this.socket.broadcast.to(res.chat_id).emit('message_read', data);
        })
    
        this.socket.on('typing', (data) => {
            let res = JSON.parse(data);
            this.socket.broadcast.to(res.chat_id).emit('typing', data);
        })
    
    }
    
    friend() {
    
        this.socket.on('invite', (data) => {
    
            let d = JSON.parse(data);
    
            if (users[d.id]) users[d.id].emit('invited', JSON.stringify(d.user));
    
        });
    
        this.socket.on('cancel_invite', (data) => {
    
            let d = JSON.parse(data);
    
            if (users[d.id]) users[d.id].emit('invite_canceled', JSON.stringify(d.user));

            this.sendNotification(d.id, `Пользователь ${d.user.nickname} отменил заявку в друзья`);
    
        })
    
        this.socket.on('reject_invite', (data) => {
    
            let d = JSON.parse(data);
    
            if (users[d.id]) users[d.id].emit('invite_rejected', JSON.stringify(d.user));

            this.sendNotification(d.id, `Пользователь ${d.user.nickname} отклонил заявку в друзья`);
    
        })
    
        this.socket.on('add_friend', (data) => {
    
            let d = JSON.parse(data);
    
            if (users[d.id]) users[d.id].emit('friend_added', JSON.stringify(d.user));

            this.sendNotification(d.id, `Пользователь ${d.user.nickname} принял заявку в друзья`);
    
        })
    
        this.socket.on('del_friend', (data) => {
    
            let d = JSON.parse(data);
    
            if (users[d.id]) users[d.id].emit('friend_deleted', JSON.stringify(d.user));

            this.sendNotification(d.id, `Пользователь ${d.user.nickname} удалил Вас из друзей`);
    
        })
    
    }
    
    
    online() {
    
        this.socket.broadcast.emit('online', this.socket.handshake.query.id);
    
        this.socket.on('disconnect', () => {
            let id = this.socket.handshake.query.id;
            setTimeout(() => {
                if (!users[id]) {
                    this.socket.broadcast.emit('offline', this.socket.handshake.query.id);
                }
            }, 10000);
        });
    
        this.socket.on('get_online', (data) => {
    
            if (users[data]) {
                this.socket.emit('is_online', JSON.stringify({id: data, result: true}));
            } else {
                this.socket.emit('is_online', JSON.stringify({id: data, result: false}));
            }
    
        })
    
    }

}

