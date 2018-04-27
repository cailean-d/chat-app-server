const mongoose = require('mongoose');

let database = mongoose.connection;
let Schema = mongoose.Schema;
let friendSchema, friends, friend;


friendSchema = new Schema({
    friend_1: {type: String, required: true},
    friend_2: {type: String, required: true},
    status: {type: String, default: 0},
    date: {type: Date, default: Date.now}
});

friends = database.model('friends', friendSchema);
 
function inviteFriend(sender, receiver){
    friend = new friends({
        friend_1: sender,
        friend_2: receiver,
    });
    return friend.save();
}

function addFriend(sender, receiver, callback){
    return friends.findOneAndUpdate({
        $and:[ 
            {friend_1: sender}, 
            {friend_2: receiver}
        ]}, 
        {status: 1}, { new: true });
}
 
function deleteFriend(sender, receiver){
    return friends.findOneAndRemove({
        $or: [
            { $and: [{friend_1: sender}, {friend_2: receiver}] },
            { $and: [{friend_1: receiver}, {friend_2: sender}] }
        ]
    });
}

function rejectFriend(sender, receiver){
    return friends.findOneAndRemove({
        $and:[ 
            {friend_1: sender}, 
            {friend_2: receiver}, 
            {status: 0}
        ]});
}

function getFriends(id){
    return friends.find({
        $and: [
            { $or: [{friend_1: id}, {friend_2: id}] },
            { status: 1 }
        ]
    });
}

function getInvites(id){
    return friends.find({ 
        $and: [ 
            { friend_2: id }, 
            { status: 0 }
        ]});
}

function getMyInvites(id) {
    return friends.find({ 
        $and: [ 
            { friend_1: id }, 
            { status: 0 }
        ]});
}

function getMyInvitesCount(id) {
    return friends.count({ 
        $and: [ 
            { friend_1: id }, 
            { status: 0 }
        ]});
}

function getInvitesCount(id){
    return friends.count({ 
        $and: [ 
            { friend_2: id }, 
            { status: 0 }
        ]});
}

function getFriendsCount(id){
    return friends.count({
        $and: [
            { $or: [{friend_1: id}, {friend_2: id}] },
            { status: 1 }
        ]
    });
}

function isFriend(user1, user2){
    return friends.findOne({
        $and:[{ 
            $or: [
                { $and: [{friend_1: user1}, {friend_2: user2}] },
                { $and: [{friend_1: user2}, {friend_2: user1}] }
                ]
            }
        , { status: 1 }]
    });
}

function isInvited(user1, user2){
    return friends.findOne({
        $and:[ 
            {friend_1: user1}, 
            {friend_2: user2}, 
            {status: 0}
        ]});
}

 module.exports.inviteFriend = inviteFriend;    
 module.exports.addFriend = addFriend;              
 module.exports.deleteFriend = deleteFriend;        
 module.exports.rejectFriend = rejectFriend;        
 module.exports.getFriends = getFriends;
 module.exports.getInvites = getInvites;
 module.exports.getFriendsCount = getFriendsCount;
 module.exports.getInvitesCount = getInvitesCount;
 module.exports.isFriend = isFriend;
 module.exports.isInvited = isInvited;
 module.exports.getMyInvites = getMyInvites;
 module.exports.getMyInvitesCount = getMyInvites;