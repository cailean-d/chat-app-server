const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const rooms = require('../database/rooms');

let database = mongoose.connection;
let Schema = mongoose.Schema;
let messageSchema, messages, message;

autoIncrement.initialize(database);

messageSchema = new Schema({
    sender: {type: Number, required: true},
    message: {type: String, required: true},
    room: {type: Number, required: true},
    status: {type: Number, default: 0},
    hidden: {type: Array},
    date: {type: Date, default: Date.now}
});

messageSchema.plugin(autoIncrement.plugin, { model: 'messages', field: 'id',  startAt: 1 });
messages = database.model('messages', messageSchema);
 
function addMessage(sender, message, room){
    message = new messages({
        sender: sender,
        message: message,
        room: room
    });
    return message.save();
}

function readMessage(message_id, room){
    return messages.findOneAndUpdate({
        $and:[
            {id: message_id}, 
            {room: room}, 
        ]}, 
        {status: 1}, {new: true})
}


function deleteMessage(user, message_id, room){
    return messages.findOneAndRemove({
        $and:[
            {id: message_id}, 
            {sender: user}, 
            {room: room}
        ]
    });
}

function hideMessage(user, message_id, room){
    return messages.findOneAndUpdate({
        $and:[
            {id: message_id}, 
            {room: room}
        ]}, 
        {$push: { hidden: user } }, {new: true})
}

function getMessages(user, room, offset, limit){
    return messages.find({
        $and: [
        { room: room },
        { hidden: { $ne: user } 
    }]
    }).skip(offset).limit(limit).sort({date: -1})
    .exec();
}

function getMessage(message_id, room){
    return messages.findOne({
        $and: [
            { room: room },
            { id: message_id}
        ]
    })
}

function getLastMessage(user, room){
    return messages.findOne({
        $and: [
        { room: room },
        { hidden: { $ne: user } 
    }]
    }).sort({date: -1})
    .exec();
}

function deleteMessagesFromRoom(room){
    return messages.findAndRemove({room: room});
}

 module.exports.addMessage = addMessage;
 module.exports.readMessage = readMessage;
 module.exports.deleteMessage = deleteMessage;
 module.exports.hideMessage = hideMessage;
 module.exports.deleteMessagesFromRoom = deleteMessagesFromRoom
 module.exports.getMessage = getMessage;
 module.exports.getMessages = getMessages;
 module.exports.getLastMessage = getLastMessage;
