const MessageModel = require('./../models/message');

class Message {

    addMessage(sender, msg, room){
        let _message = new MessageModel({
            sender: sender,
            message: msg,
            room: room
        });
        return _message.save();
    }
    
    readMessage(message_id, room){
        return MessageModel.findOneAndUpdate({
            $and:[
                {id: message_id}, 
                {room: room}, 
            ]}, 
            {status: 1}, {new: true})
    }
    
    deleteMessage(user, message_id, room){
        return MessageModel.findOneAndRemove({
            $and:[
                {id: message_id}, 
                {sender: user}, 
                {room: room}
            ]
        });
    }
    
    hideMessage(user, message_id, room){
        return MessageModel.findOneAndUpdate({
            $and:[
                {id: message_id}, 
                {room: room}
            ]}, 
            {$push: { hidden: user } }, {new: true})
    }
    
    getMessages(user, room, offset, limit){
        return MessageModel.find({
            $and: [
            { room: room },
            { hidden: { $ne: user }}
        ]
        }).skip(offset).limit(limit).sort({date: -1})
        .exec();
    }
    
    getMessage(message_id, room){
        return MessageModel.findOne({
            $and: [
                { room: room },
                { id: message_id}
            ]
        })
    }
    
    getLastMessage(user, room){
        return MessageModel.findOne({
            $and: [
            { room: room },
            { hidden: { $ne: user } 
        }]
        }).sort({date: -1})
        .exec();
    }
    
    deleteMessagesFromRoom(room){
        return MessageModel.findAndRemove({room: room});
    }

    getUnreadMessageCount(user, room){
        return MessageModel.count({
            $and: [
            { room: room },
            { sender: { $ne: user }},
            { status: 0 }
        ]
        });
    }
    
}

module.exports = new Message();