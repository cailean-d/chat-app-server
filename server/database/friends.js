const FriendModel = require('./../models/friend');

class Friend {
 
    inviteFriend(sender, receiver) {
        let friend = new FriendModel({
            friend_1: sender,
            friend_2: receiver,
        });
        return friend.save();
    }
    
    addFriend(sender, receiver, callback) {
        return FriendModel.findOneAndUpdate({
            $and:[ 
                {friend_1: sender}, 
                {friend_2: receiver}
            ]}, 
            {status: 1}, { new: true });
    }
     
    deleteFriend(sender, receiver) {
        return FriendModel.findOneAndRemove({
            $or: [
                { $and: [{friend_1: sender}, {friend_2: receiver}] },
                { $and: [{friend_1: receiver}, {friend_2: sender}] }
            ]
        });
    }
    
    rejectFriend(sender, receiver) {
        return FriendModel.findOneAndRemove({
            $and:[ 
                {friend_1: sender}, 
                {friend_2: receiver}, 
                {status: 0}
            ]});
    }
    
    getFriends(id) {
        return FriendModel.find({
            $and: [
                { $or: [{friend_1: id}, {friend_2: id}] },
                { status: 1 }
            ]
        });
    }
    
    getInvites(id) {
        return FriendModel.find({ 
            $and: [ 
                { friend_2: id }, 
                { status: 0 }
            ]});
    }
    
    getMyInvites(id) {
        return FriendModel.find({ 
            $and: [ 
                { friend_1: id }, 
                { status: 0 }
            ]});
    }
    
    getMyInvitesCount(id) {
        return FriendModel.count({ 
            $and: [ 
                { friend_1: id }, 
                { status: 0 }
            ]});
    }
    
    getInvitesCount(id) {
        return FriendModel.count({ 
            $and: [ 
                { friend_2: id }, 
                { status: 0 }
            ]});
    }
    
    getFriendsCount(id) {
        return FriendModel.count({
            $and: [
                { $or: [{friend_1: id}, {friend_2: id}] },
                { status: 1 }
            ]
        });
    }
    
    isFriend(user1, user2) {
        return FriendModel.findOne({
            $and:[{ 
                $or: [
                    { $and: [{friend_1: user1}, {friend_2: user2}] },
                    { $and: [{friend_1: user2}, {friend_2: user1}] }
                    ]
                }
            , { status: 1 }]
        });
    }
    
    isInvited(user1, user2) {
        return FriendModel.findOne({
            $and:[ 
                {friend_1: user1}, 
                {friend_2: user2}, 
                {status: 0}
            ]});
    }
}

module.exports = new Friend();