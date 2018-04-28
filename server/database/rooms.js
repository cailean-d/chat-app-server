const RoomModel = require('./../models/room');

class Room {
 
    addRoom(owner, user){
        let room = new RoomModel({ 
            owner: owner,
            users: [owner, user]
        });
        return room.save(); 
    }
    
    findRoom(room){
        return RoomModel.findOne({id : room});
    }
    
    deleteRoom(room){
        return RoomModel.findOneAndRemove({id : room});
    }
    
    setPic(room, picture){
        return RoomModel.findOneAndUpdate(
            {id: room}, 
            {pic: picture}, 
            { new: true })
    }
    
    setTitle(room, title){
        return RoomModel.findOneAndUpdate(
            {id: room}, 
            {title: title}, 
            { new: true })
    }
    
    addUser(room, user){
        return RoomModel.update(
            { id: room }, 
            { $push: 
                { users: user } 
            });
    }
    
    deleteUser(room, user){
        return RoomModel.update(
            { id: room }, 
            { $pull: 
                { users: user } 
            });
    }
}

module.exports = new Room();