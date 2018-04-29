const database = require('../database/friends');
const usersDatabase = require('../database/users');

class FriendAPI {

    async inviteFriend(req, res){
        try {
            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required', 
                    data: null
                }); 
            }
    
            if(req.params.id == req.session.userid){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot use your own id', 
                    data: null
                }); 
            }
    
            req.params.id = Number(req.params.id);
    
            let userIsFriend = await database.isFriend(req.session.userid, req.params.id);
            let userIsInvited = await database.isInvited(req.session.userid, req.params.id);
            let user = await usersDatabase.getUser(req.params.id);
    
            if(!user){
                return res.status(400).json({ status: 400, message: 'User doesnt exist', data: null}); 
            }
    
            if(userIsFriend){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already your friend', 
                    data: null
                }); 
            }
    
            if(userIsInvited){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already invited', 
                    data: null
                }); 
            }
    
            await database.inviteFriend(req.session.userid, req.params.id);
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async addFriend(req, res){
        try {
            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400,
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required', 
                    data: null
                }); 
            }
            
            if(req.params.id == req.session.userid){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot use your own id', 
                    data: null
                }); 
            }
    
            req.params.id = Number(req.params.id);
            
            let isInvited = await database.isInvited(req.params.id, req.session.userid);
            let userIsFriend = await database.isFriend(req.session.userid, req.params.id);
            let user = await usersDatabase.getUser(req.params.id);
            
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist', 
                    data: null
                }); 
            }
    
            if(userIsFriend){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already your friend',
                    data: null
                }); 
            }
            
            if(!isInvited){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You are not invited by this user',
                    data: null
                }); 
            }
    
            await database.addFriend(req.params.id, req.session.userid);
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
        
    async deleteFriend(req, res){
        try {
            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
            
            if(req.params.id == req.session.userid){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot use your own id',
                    data: null
                }); 
            }
    
            req.params.id = Number(req.params.id);
    
            let userIsFriend = await database.isFriend(req.session.userid, req.params.id);
            let user = await usersDatabase.getUser(req.params.id);
    
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist', 
                    data: null
                }); 
            }
    
            if(!userIsFriend){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is not your friend',
                    data: null
                }); 
            }
        
            await database.deleteFriend(req.session.userid, req.params.id);
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async rejectFriend(req, res){
        try {
            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
            
            if(req.params.id == req.session.userid){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot use your own id',
                    data: null
                }); 
            }
            
            req.params.id = Number(req.params.id);
            
            let userIsFriend = await database.isFriend(req.session.userid, req.params.id);
            let isInvited = await database.isInvited(req.params.id, req.session.userid);
            let user = await usersDatabase.getUser(req.params.id);
            
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist',
                    data: null
                }); 
            }
    
            if(userIsFriend){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already your friend',
                    data: null
                }); 
            }
            
            if(!isInvited){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You are not invited by this user',
                    data: null
                }); 
            }
    
            await database.rejectFriend(req.params.id, req.session.userid);
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async cancelInvite(req, res){
        try {
            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
            
            if(req.params.id == req.session.userid){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot use your own id',
                    data: null
                }); 
            }
    
            req.params.id = Number(req.params.id);        
    
            let userIsFriend = await database.isFriend(req.session.userid, req.params.id);
            let userIsInvited = await database.isInvited(req.session.userid, req.params.id);
            let user = await usersDatabase.getUser(req.params.id);
    
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist',
                    data: null
                }); 
            }
    
            if(userIsFriend){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already your friend',
                    data: null
                }); 
            }
    
            if(!userIsInvited){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is not invited',
                    data: null
                }); 
            }
    
            await database.rejectFriend(req.session.userid, req.params.id);
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getFriends(req, res){
        try {
            let friends_id =  await database.getFriends(req.session.userid);
            let friends = await getListOfUsers(req, res, friends_id);
            return res.status(200).json({ status: 200, message: "success", data: friends});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getInvites(req, res){
        try {
            let invites_id = await database.getInvites(req.session.userid);
            let invites = await getListOfUsers(req, res, invites_id);
            return res.status(200).json({ status: 200, message: "success", data: invites});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getInvitesCount(req, res){
        try {
            let invitesCount = await database.getInvitesCount(req.session.userid);
            return res.status(200).json({ status: 200, message: "success", data: invitesCount});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getFriendsCount(req, res){
        try {
            let friendsCount = await database.getFriendsCount(req.session.userid);
            return res.status(200).json({ status: 200, message: "success", data: friendsCount});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getListOfUsers(req, res, results){
        try {
            if(results.length == 0){
                return null;
            }
        
            let users =  [];
        
            for(element of results){
                let friend;
        
                if(req.session.userid == element.friend_1){
                    friend = element.friend_2;
                } else {
                    friend = element.friend_1;
                }
        
                let user = await usersDatabase.getUser(friend);
        
                if(!user){
                   return res.status(400).json({ 
                       status: 400, 
                       message: 'User not found', 
                       data: null
                    });
                }
        
                users.push({
                    id: user.id,
                    nickname: user.nickname,
                    avatar: user.avatar,
                    gender: user.gender,
                    country: user.country,
                    city: user.city,
                });
            }
            return users;
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null});
        }
    }
    
    async isFriend(req, res){
        try {
            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
                    
            if(req.params.id == req.session.userid){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot use your own id',
                    data: null
                }); 
            }
    
            req.params.id = Number(req.params.id);
            
            let user = await usersDatabase.getUser(req.params.id);
            
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist',
                    data: null
                }); 
            }
    
            let isfriend = await database.isFriend(req.session.userid, req.params.id);
            
            if(!isfriend){
                return res.status(200).json({ status: 200, message: "success", data: false});
            }
    
            return res.status(200).json({ status: 200, message: "success", data: true});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null});
        }
    }
    
    async isInvited(req, res){
        try {
            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
            
            if(req.params.id == req.session.userid){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot use your own id',
                    data: null
                }); 
            }
    
            req.params.id = Number(req.params.id);        
    
            let user = await usersDatabase.getUser(req.params.id);
            
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist',
                    data: null
                }); 
            }
    
            let isinvited = await database.isInvited(req.session.userid, req.params.id);
            
            if(!isinvited){
                return res.status(200).json({ status: 200, message: "success", data: false});
            }
    
            return res.status(200).json({ status: 200, message: "success", data: true});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null});
        }
    }
    
    async meIsInvited(req, res){
        try {
            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'Id is required',
                    data: null
                }); 
            }
                    
            if(req.params.id == req.session.userid){
                return res.status(400).json({ 
                    status: 400,
                    message: 'You cannot use your own id',
                    data: null
                    }); 
            }
            
            req.params.id = Number(req.params.id);
            
            let user = await usersDatabase.getUser(req.params.id);
            
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User doesnt exist',
                    data: null
                }); 
            }
    
            let meisinvited = await database.isInvited(req.params.id, req.session.userid);
            
            if(!meisinvited){
                return res.status(400).json({ status: 400, message: "success", data: false});
            }
    
            return res.status(200).json({ status: 200, message: "success", data: true});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error});
        }
    }
    
    async getMyInvites(req, res) {
        try {
            let invites_id = await database.getMyInvites(req.session.userid);
            let invites = await getListOfUsers(req, res, invites_id);
            return res.status(200).json({ status: 200, message: "success", data: invites});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getMyInvitesCount(req, res){
        try {
            let invitesCount = await database.getMyInvitesCount(req.session.userid);
            return res.status(200).json({ status: 200, message: "success", data: invitesCount});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }

}

module.exports = new FriendAPI();
