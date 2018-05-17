const database = require('../database/rooms');
const users = require('../database/users');
const messages = require('../database/messages');

class RoomAPI {

    constructor() {
        const proto = Object.getPrototypeOf(this);
        const names = Object.getOwnPropertyNames(proto);
        for (const i of names) {
            this[i] = this[i].bind(this);
        }
    }

    async getRooms(req, res){

        try {
            let user = await users.getUser(req.user.id);
    
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist',
                    data: null
                }); 
            }
    
            let rooms = user.rooms;
            let data = [];
    
            if(rooms.length == 0){
                return res.status(200).json({ 
                    status: 200, 
                    message: 'no rooms', 
                    data: null
                });
            } 
    
            for(let room_id of rooms){
                let room = await database.findRoom(room_id);
    
                if(!room){
                    return res.status(400).json({ 
                        status: 400, 
                        message: "Room doesnt exist", 
                        data: null
                    }); 
                }
    
                let lastMessage = await messages.getLastMessage(req.user.id, room_id);
    
                if(lastMessage){
    
                    let sender = await users.getUser(lastMessage.sender);
    
                    if(!sender){
                        return res.status(400).json({ 
                            status: 400, 
                            message: "User doesnt exist", 
                            data: null
                        }); 
                    }
    
                    if(room.users.length > 2) {
                        data.push({
                            id: room.id,
                            title : room.title,
                            picture: room.pic,
                            message: lastMessage.message,
                            users: room.users
                        });
                    } else {
                        data.push({
                            id: room.id,
                            title : sender.nickname,
                            picture: sender.avatar,
                            message: lastMessage.message,
                            users: room.users
                        });
                    }
                }
            }
    
            if(data.length > 0){
                return res.status(200).json({ status: 200, message: "success", data: data});   
            }
    
            return res.status(200).json({ status: 200, message: "success", data: null});   
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null});   
        }
    }
    
    async getRoom(req, res){
        try {
            if(!req.params.room){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
    
            if(!/^\d+$/.test(req.params.room)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            req.params.room = Number(req.params.room);
            
            let user = await users.getUser(req.user.id);
    
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist',
                    data: null
                }); 
            }
    
            let rooms = user.rooms;
    
            if(rooms.length == 0){
                return res.status(200).json({ 
                    status: 200, 
                    message: 'no rooms', 
                    data: null
                });
            }
    
            let room = await database.findRoom(req.params.room);
    
            if(!room){
                return res.status(400).json({ 
                    status: 400, 
                    message: "Room doesnt exist", 
                    data: null
                }); 
            }
    
            let lastMessage = await messages.getLastMessage(req.user.id, room.id);
    
            if(lastMessage){
                let sender = users.getUser(lastMessage.sender);
    
                if(!sender){
                    return res.status(400).json({ 
                        status: 400, 
                        message: "User doesnt exist",
                        data: null
                    }); 
                }
    
                if(room.users.length > 2) {
                    return res.status(200).json({ status: 200, message: "success", data: {
                        id: room.id,
                        title : room.title,
                        picture: room.pic,
                        message: lastMessage.message,
                        users: room.users
                    }});   
                } else {
                    return res.status(200).json({ status: 200, message: "success", data: {
                        id: room.id,
                        title : sender.nickname,
                        picture: sender.avatar,
                        message: lastMessage.message,
                        users: room.users
                    }});   
                }
            }
    
            return res.status(200).json({ status: 200, message: "success", data: null});   
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null});   
        }
    }
    
    async deleteRoom(req, res){
        try {
            if(!req.params.room){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
    
            if(!/^\d+$/.test(req.params.room)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            req.params.room = Number(req.params.room);
    
            let room = await database.findRoom(req.params.room);
    
            if(room.owner == req.user.id){
                await database.deleteRoom(req.params.room);
                await messages.deleteMessagesFromRoom(req.params.room);
                res.status(200).json({status: 200, message: "success", data: null});           
            } else {
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot delete the room',
                    data: null
                }); 
            }
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async addUserToRoom(req, res){
        try {
            if(!req.params.room){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
            
            if(!req.params.user){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-user- is required',
                    data: null
                }); 
            }
    
            if(!/^\d+$/.test(req.params.room)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(!/^\d+$/.test(req.params.user)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-user- must be a number",
                    data: null
                });
            }
    
            req.params.user = Number(req.params.user);
            req.params.room = Number(req.params.room);
    
            let room = await database.findRoom(req.params.room);
            let user = await users.getUser(req.params.user);
            
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist',
                    data: null
                }); 
            }
    
            if(room.users.indexOf(req.params.user) != -1){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already in the room',
                    data: null
                }); 
            }
    
            if(!room.title){
                if(!req.body.title){
                    return res.status(400).json({ 
                        status: 400, 
                        message: "-title- is required",
                        data: null
                    }); 
                }
    
                if(!/^[A-zА-яЁё ]*$/.test(req.body.title)){
                    return res.status(400).json({ 
                        status: 400, 
                        message: "-title- must contain only letters and spaces",
                        data: null
                    });
                }
    
                if(req.body.title.length < 3 && req.body.title.length > 30){
                    return res.status(400).json({ 
                        status: 400, 
                        message: "-title- 's length must be more then 3 and less then 30",
                        data: null
                    }); 
                }
    
                await database.setTitle(req.params.room, req.body.title);
            }
    
            if(room.owner == req.user.id){
                await database.addUser(req.params.room, req.params.user);
                await users.addRoom(req.params.room, req.params.user);
                res.status(200).json({status: 200, message: "success", data: null});           
            } else {
                 return res.status(400).json({ 
                     status: 400, 
                     message: 'You cannot add users', 
                     data: null
                    }); 
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null }); 
        }
    }
    
    async deleteUserFromRoom(req, res){
        try {
            if(!req.params.room){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
            
            if(!req.params.user){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-user- is required',
                    data: null
                }); 
            }
    
            if(!/^\d+$/.test(req.params.room)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(!/^\d+$/.test(req.params.user)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-user- must be a number",
                    data: null
                });
            }
    
            if(req.params.user == req.user.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot delete yourself',
                    data: null
                }); 
            }
    
            req.params.room = Number(req.params.room);
            req.params.user = Number(req.params.user);
            
            let room = await database.findRoom(req.params.room);
            let user = await users.getUser(req.params.user);
            
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist',
                    data: null
                }); 
            }
    
            if(room.users.indexOf(req.params.user) == -1){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User does not exist in the room',
                    data: null
                }); 
            }
    
            if(room.owner == req.user.id){
               await database.deleteUser(req.params.room, req.params.user);
               await users.deleteRoom(req.params.room, req.params.user);
               res.status(200).json({status: 200, message: "success", data: null});           
            } else {
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot delete users',
                    data: null
                }); 
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getUsersFromRoom(req, res){
        try {
            if(!req.params.room){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
    
    
            if(!/^\d+$/.test(req.params.room)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            req.params.room = Number(req.params.room);
    
            let room = await database.findRoom(req.params.room);
    
            if(!room){
                return res.status(400).json({status: 400, message: "Room not found", data: null});
            }
    
            return res.status(200).json({ status: 400, message: 'success', data: room.users});
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getOwner(req, res){
        try {
            if(!req.params.room){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
    
            if(!/^\d+$/.test(req.params.room)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            req.params.room = Number(req.params.room);
    
            let room = await database.findRoom(req.params.room);
    
            if(!room){
                return res.status(400).json({status: 400, message: "Room not found", data: null});
            }
    
            return res.status(200).json({ status: 400, message: 'success', data: room.owner});
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async openRoom(req, res) {
        try {
            if(!req.params.user){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
    
            if(!/^\d+$/.test(req.params.user)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(req.params.user == req.user.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot use your own id',
                    data: null
                }); 
            }
    
            let user1 = await users.getUser(req.user.id);
            let user2 = await users.getUser(req.params.user);
    
            if(!user1 || !user2){
                return res.status(400).json({ 
                    status: 400, 
                    message: "User doesnt exist",
                    data: null
                }); 
            }
    
            let rooms = user1.rooms;
    
            if(rooms.length == 0) {
                return this.createRoom(req, res);
            }
    
            for(room_id of rooms){
                let room = await database.findRoom(room_id);
                let users = room.users;
    
                if(users.length == 2){
                    if((users[0] == req.user.id && users[1] == req.params.user)
                    || (users[1] == req.user.id && users[0] == req.params.user)){
                       return res.status(200).json({ status: 200, message: "success", data: room.id});
                    }
                } 
            }
    
            return this.createRoom(req, res);
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async createRoom(req, res){
        try {
            let room = await database.addRoom(req.user.id, req.params.user);
            await users.addRoom(room.id, req.user.id);
            await users.addRoom(room.id, req.params.user);
            return res.status(200).json({ status: 200, message: "success", data: room.id});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }

}

module.exports = new RoomAPI();
