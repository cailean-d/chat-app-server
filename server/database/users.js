const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

let database = mongoose.connection;
let Schema = mongoose.Schema;
let userSchema, users, user;

autoIncrement.initialize(database);

userSchema = new Schema({
    nickname: {type: String, required: true, unique: "nickname already exists"},
    firstname: {type: String, default: null},
    lastname: {type: String, default: null},
    email: {type: String, required: true, unique : "email already exists"},
    password: {type: String, required: true},
    avatar: {type: String, default: 'default.jpg'},
    status: {type: String, default: 'offile'},
    gender: {type: String, default: null},
    about: {type: String, default: null},
    birthday: {type: Date, default: null},
    phone: {type: String, default: null},
    website: {type: String, default: null},
    country: {type: String, default: null},
    city: {type: String, default: null},
    language: {type: Array, default: null},
    rooms: {type: Array, default: null},
    deleted: {type: Boolean, default: false},
    date: {type: Date, default: Date.now}
});

userSchema.plugin(autoIncrement.plugin, { model: 'users', field: 'id',  startAt: 1 });
users = database.model('users', userSchema);
 
 
function registerUser(nickname, email, password){
    user = new users({
        nickname: nickname,
        email: email,
        password: password,
    });
    return user.save();
}
 
function deleteUser(id){
    return users.findOneAndUpdate({id : id}, {$set: {deleted: true}}, { new: true })
}

function restoreUser(id) {
    return users.findOneAndUpdate({id : id}, {$set: {deleted: false}}, { new: true })
}

function getUser(id){
    return users.findOne({id : id});
}

function getUserByEmail(email){
    return users.findOne({email : email});
}

function updateUser(id, data){
    return users.findOneAndUpdate({id : id}, {$set:data}, { new: true })
}

function getUsers(offset, limit){
    return users.find({}).skip(offset).limit(limit).exec();
}

function getCount(){
    return users.count({});
}

function addRoom(room, user){
    return users.update(
        { id: user }, 
        { $push: { rooms: room } 
    });  
}

function deleteRoom(room, user){
    return users.update(
        { id: user }, 
        { $pull: { rooms: room } 
    });
}

 module.exports.registerUser = registerUser;    
 module.exports.getUser = getUser;              
 module.exports.updateUser = updateUser;        
 module.exports.deleteUser = deleteUser;        
 module.exports.getUsers = getUsers;
 module.exports.getCount = getCount;
 module.exports.getUserByEmail = getUserByEmail;
 module.exports.addRoom = addRoom;
 module.exports.deleteRoom = deleteRoom;
 module.exports.restoreUser = restoreUser;