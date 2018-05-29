const database = require('../database/friends');
const usersDatabase = require('../database/users');

class FriendAPI {

    constructor() {
        const proto = Object.getPrototypeOf(this);
        const names = Object.getOwnPropertyNames(proto);
        for (const i of names) {
            this[i] = this[i].bind(this);
        }
    }

    async inviteFriend(req, res){
        try {

            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required', 
                    data: null
                }); 
            }

            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            if(req.params.id == req.user.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot use your own id', 
                    data: null
                }); 
            }
    
            req.params.id = Number(req.params.id);
    
            let user = await usersDatabase.getUser(req.params.id);
    
            if(!user){
                return res.status(400).json({ status: 400, message: 'User doesnt exist', data: null}); 
            }

            let userIsFriend = await database.isFriend(req.user.id, req.params.id);
    
            if(userIsFriend){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already your friend', 
                    data: null
                }); 
            }

            let userIsInvited = await database.isInvited(req.user.id, req.params.id);
    
            if(userIsInvited){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already invited', 
                    data: null
                }); 
            }
    
            await database.inviteFriend(req.user.id, req.params.id);
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async addFriend(req, res){
        try {
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required', 
                    data: null
                }); 
            }

            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400,
                    message: "-id- must be a number",
                    data: null
                });
            }

            if(req.params.id == req.user.id){
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

            let userIsFriend = await database.isFriend(req.user.id, req.params.id);
    
            if(userIsFriend){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already your friend',
                    data: null
                }); 
            }

            let isInvited = await database.isInvited(req.params.id, req.user.id);
            
            if(!isInvited){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You are not invited by this user',
                    data: null
                }); 
            }
    
            await database.addFriend(req.params.id, req.user.id);
            return res.status(200).json({ status: 200, message: "success", data: user});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
        
    async deleteFriend(req, res){
        try {
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }

            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
            
            if(req.params.id == req.user.id){
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

            let userIsFriend = await database.isFriend(req.user.id, req.params.id);
    
            if(!userIsFriend){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is not your friend',
                    data: null
                }); 
            }
        
            await database.deleteFriend(req.user.id, req.params.id);
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async rejectFriend(req, res){
        try {
                
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }

            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }

            if(req.params.id == req.user.id){
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

            let userIsFriend = await database.isFriend(req.user.id, req.params.id);
    
            if(userIsFriend){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already your friend',
                    data: null
                }); 
            }

            let isInvited = await database.isInvited(req.params.id, req.user.id);
            
            if(!isInvited){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You are not invited by this user',
                    data: null
                }); 
            }
    
            await database.rejectFriend(req.params.id, req.user.id);
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async cancelInvite(req, res){
        try {
    
            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }

            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }

            if(req.params.id == req.user.id){
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

            let userIsFriend = await database.isFriend(req.user.id, req.params.id);
    
            if(userIsFriend){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is already your friend',
                    data: null
                }); 
            }
            
            let userIsInvited = await database.isInvited(req.user.id, req.params.id);
    
            if(!userIsInvited){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User is not invited',
                    data: null
                }); 
            }
    
            await database.rejectFriend(req.user.id, req.params.id);
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getFriends(req, res){
        try {
            let friends_id =  await database.getFriends(req.user.id);
            let friends = await this.getListOfUsers(req, res, friends_id);
            return res.status(200).json({ status: 200, message: "success", data: friends});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getInvites(req, res){
        try {
            let invites_id = await database.getInvites(req.user.id);
            let invites = await this.getListOfUsers(req, res, invites_id);
            return res.status(200).json({ status: 200, message: "success", data: invites});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getInvitesCount(req, res){
        try {
            let invitesCount = await database.getInvitesCount(req.user.id);
            return res.status(200).json({ status: 200, message: "success", data: invitesCount});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getFriendsCount(req, res){
        try {
            let friendsCount = await database.getFriendsCount(req.user.id);
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
        
            for(let element of results){
                let friend;
        
                if(req.user.id == element.friend_1){
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
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    avatar: user.avatar,
                    gender: user.gender,
                    about: user.about,
                    birthday: user.birthday,
                    phone: user.phone,
                    website: user.website,
                    country: user.country,
                    city: user.city,
                    language: user.language,
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
                    
            if(req.params.id == req.user.id){
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
    
            let isfriend = await database.isFriend(req.user.id, req.params.id);
            
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
            
            if(req.params.id == req.user.id){
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
    
            let isinvited = await database.isInvited(req.user.id, req.params.id);
            
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
                    
            if(req.params.id == req.user.id){
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
    
            let meisinvited = await database.isInvited(req.params.id, req.user.id);
            
            if(!meisinvited){
                return res.status(200).json({ status: 200, message: "success", data: false});
            }
    
            return res.status(200).json({ status: 200, message: "success", data: true});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error});
        }
    }
    
    async getMyInvites(req, res) {
        try {
            let invites_id = await database.getMyInvites(req.user.id);
            let invites = await getListOfUsers(req, res, invites_id);
            return res.status(200).json({ status: 200, message: "success", data: invites});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getMyInvitesCount(req, res){
        try {
            let invitesCount = await database.getMyInvitesCount(req.user.id);
            return res.status(200).json({ status: 200, message: "success", data: invitesCount});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }

}

module.exports = new FriendAPI();
