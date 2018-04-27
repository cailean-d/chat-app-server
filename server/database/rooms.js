const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

let database = mongoose.connection;
let Schema = mongoose.Schema;
let roomSchema, rooms, room;

autoIncrement.initialize(database);

roomSchema = new Schema({
    title: {type: String,  default: null},
    pic: {type: String,  default: 'room.png'},
    owner: {type: String, required: true},
    users: {type: Array, required: true},
    date: {type: Date, default: Date.now}
});

roomSchema.plugin(autoIncrement.plugin, { model: 'rooms', field: 'id',  startAt: 1 });
rooms = database.model('rooms', roomSchema);
 
function addRoom(owner, user){
    room = new rooms({ 
        owner: owner,
        users: [owner, user]
    });
    return room.save(); 
}

function findRoom(room){
    return rooms.findOne({id : room});
}

function deleteRoom(room){
    return rooms.findOneAndRemove({id : room});
}

function setPic(room, picture){
    return rooms.findOneAndUpdate(
        {id: room}, 
        {pic: picture}, 
        { new: true })
}

function setTitle(room, title){
    return rooms.findOneAndUpdate(
        {id: room}, 
        {title: title}, 
        { new: true })
}

function addUser(room, user){
    return rooms.update(
        { id: room }, 
        { $push: 
            { users: user } 
        });
}
function deleteUser(room, user){
    return rooms.update(
        { id: room }, 
        { $pull: 
            { users: user } 
        });
}

module.exports.addRoom = addRoom;
module.exports.findRoom = findRoom;
module.exports.deleteRoom = deleteRoom;
module.exports.deleteUser = deleteUser;
module.exports.addUser = addUser;
module.exports.setTitle = setTitle;
