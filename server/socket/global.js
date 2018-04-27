module.exports = function(io){
    io.on('connection', function(socket){
        // socket.userid =  socket.handshake.query.id;
        // socket.username =  socket.handshake.query.nickname;
        // socket.avatar =  socket.handshake.query.avatar;
        console.log('user connected');
        socket.on('test', (data) =>{
            console.log(data);
        })
    });


}
    