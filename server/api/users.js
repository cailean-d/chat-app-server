const database = require('../database/users');
const bcrypt = require('bcryptjs');       
const htmlspecialchars = require('htmlspecialchars');

class UserAPI {

    async getUsers(req, res){
        try {
    
            let offset, limit;
    
            // if(!/^\d+$/.test(req.query.offset)){
            //     return res.status(400).json({ 
            //         status: 400, 
            //         message: "-offset- must be a number", 
            //         data: null
            //     });
            // }
    
            // if(!/^\d+$/.test(req.query.limit)){
            //     return res.status(400).json({ 
            //         status: 400, 
            //         message: "-limit- must be a number", 
            //         data: null
            //     });
            // }
            
            offset = req.query.offset ? Number(req.query.offset) : 0;
            limit = req.query.limit ? Number(req.query.limit) : 20;
    
            if (limit > 20) limit = 20; 
    
            let users;
    
            if (req.query.name) {
                users = await database.getUsersByName(req.query.name, offset, limit);
            } else {
                users = await database.getUsers(offset, limit);
            }

            let data = [];

            for(let user of users){
                data.push({
                    id: user.id,
                    nickname: user.nickname,
                    firstname: user.firstname,
                    lastname: user.lastname,
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
            res.status(200).json({ status: 200, message: "success", data: data});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getUser(req, res){
        try {
            if(!/^\d+$/.test(req.params.id)){
               return res.status(400).json({ status: 400, message: "-id- must be a number", data: null});
            }
    
            req.params.id = Number(req.params.id);
    
            let user = await database.getUser(req.params.id);
    
            if(!user){
               return res.status(404).json({ status: 404, message: 'User not found', data: null});
            }
    
            if(user.deleted){
               return res.status(200).json({ status: 200, message: 'User is deleted', 
               data: {
                id: user.id,
                nickname: user.nickname
               }});
            }
    
            // if(user.id == req.user.id){
            //     return res.status(200).json({ 
            //         status: 200, 
            //         message: 'success', 
            //         data: {
            //             id: user.id,
            //             nickname: user.nickname,
            //             email: user.email,
            //             date: user.date,
            //             rooms: user.rooms,
            //             language: user.language,
            //             city: user.city,
            //             country: user.country,
            //             website: user.website,
            //             phone: user.phone,
            //             birthday: user.birthday,
            //             about: user.about,
            //             gender: user.gender,
            //             status: user.status,
            //             avatar: user.avatar,
            //             lastname: user.lastname,
            //             firstname: user.firstname
            //         }
            //     });
            // } else {
                return res.status(200).json({ 
                    status: 200, 
                    message: 'success', 
                    data: {
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
                    }
                });
            // }
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getMyProfile(req, res){
        try {
            let user = await database.getUser(req.user.id);
    
            if(!user){
               return res.status(404).json({ status: 404, message: 'User not found', data: null});
            }
    
            if(user.deleted){
                return res.status(200).json({ 
                    status: 200, 
                    message: 'Your profile is deleted. You can send request "PUT api/users/restore" to restore your profile.', 
                    data: {
                        id: user.id,
                        nickname: user.nickname
                    }
                });
            }
    
            return res.status(200).json({ 
                status: 200, 
                message: 'success', 
                data: {
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    date: user.date,
                    rooms: user.rooms,
                    language: user.language,
                    city: user.city,
                    country: user.country,
                    website: user.website,
                    phone: user.phone,
                    birthday: user.birthday,
                    about: user.about,
                    gender: user.gender,
                    status: user.status,
                    avatar: user.avatar,
                    lastname: user.lastname,
                    firstname: user.firstname
                }
            });
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async updateUser(req, res){
        try {
            
            if(req.body.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot change your id', 
                    data: null
                }); 
            }
    
            if(req.body.date){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot change your registration date',
                    data: null
                }); 
            }
    
            if(req.body.email){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot change your email',
                    data: null
                }); 
            }
    
            if(req.body.status){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot change your status',
                    data: null
                }); 
            }
    
            if(req.body.rooms){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot change your rooms',
                    data: null
                }); 
            }
    
            if(req.body.deleted){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You cannot change your delete status',
                    data: null
                }); 
            }
    
            if(req.body.fistname && !/^[A-zА-яЁё]*$/.test(req.body.fistname)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-firstname- must contain only letters",
                    data: null
                }); 
            }
    
            if(req.body.fistname && (req.body.fistname.length < 2 && req.body.fistname.length > 30)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-firstname- 's length must be more then 2 and less then 30",
                    data: null
                }); 
            }
    
            if(req.body.lastname && !/^[A-zА-яЁё]*$/.test(req.body.lastname)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-lastname- must contain only letters",
                    data: null
                }); 
            }
    
            if(req.body.lastname && (req.body.lastname.length < 2 && req.body.lastname.length > 30)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-lastname- 's length must be more then 2 and less then 30",
                    data: null
                }); 
            }
    
            if(req.body.nickname && !/^[A-Za-z]+[0-9]*[-_]*/.test(req.body.nickname)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-nickname- must contain only letters, numbers and -_",
                    data: null
                }); 
            }
    
            if(req.body.nickname && (req.body.nickname.length < 4 && req.body.nickname.length > 30)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-nickname- 's length must be more then 4 and less then 30",
                    data: null
                }); 
            }
    
            if(req.body.gender && (req.body.gender != 'male' && req.body.gender != 'female')){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-gender- must be only male/female",
                    data: null
                }); 
            }
    
            if(req.body.about && (req.body.about.length < 1 && req.body.about.length > 255)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-about- 's length must be more then 1 and less then 255",
                    data: null
                }); 
            }
    
            if(req.body.about){
                req.body.about = htmlspecialchars(req.body.about);
            }
    
            if(req.body.website && !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(req.body.website)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-website- incorrect url",
                    data: null
                }); 
            }
    
            if(req.body.website && (req.body.website.length < 5 && req.body.website.length > 100)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-website- 's length must be more then 5 and less then 100",
                    data: null
                }); 
            }
    
            
            if(req.body.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(req.body.phone)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-phone- incorrect phone number",
                    data: null
                }); 
            }
    
            if(req.body.phone && (req.body.phone.length < 5 && req.body.phone.length > 15)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-phone- 's length must be more then 5 and less then 15",
                    data: null
                }); 
            }
            
            if(req.body.country && !/^[A-zА-яЁё]*$/.test(req.body.country)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-lastname- must contain only letters",
                    data: null
                }); 
            }
    
            if(req.body.country && (req.body.country.length < 3 && req.body.country.length > 40)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-lastname- 's length must be more then 3 and less then 40",
                    data: null
                }); 
            }
    
            if(req.body.city && !/^[A-zА-яЁё]*$/.test(req.body.city)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-lastname- must contain only letters",
                    data: null
                }); 
            }
    
            if(req.body.city && (req.body.city.length < 3 && req.body.city.length > 40)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-lastname- 's length must be more then 3 and less then 40",
                    data: null
                }); 
            }
    
            if(req.body.language && !Array.isArray(req.body.language)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-language- must be an array",
                    data: null
                }); 
            }
    
            if(req.body.password){
    
                if(!req.body.oldpassword){
                    return res.status(400).json({ 
                        status: 400, 
                        message: "-oldpassword- is required",
                        data: null
                    }); 
                }
    
                if(req.body.password.length < 6 && req.body.password.length > 50){
                    return res.status(400).json({ 
                        status: 400, 
                        message: "-password- 's length must be more then 6 and less then 50",
                        data: null
                    }); 
                }
    
                let user = await database.getUser(req.user.id);
    
                if (!user){
                    return res.status(404).json({ 
                        status: 404, 
                        message: 'User not found',
                        data: null
                    });
                } 
    
                let comparePassword = await bcrypt.compare(req.body.oldpassword, user.password);
    
                if(!comparePassword){
                    return res.status(400).json({ status: 400, message: `Incorrect password`, data: null});
                }
    
                let compareNewPassword = await bcrypt.compare(req.body.password, user.password);
    
                if(compareNewPassword){
                    return res.status(200).json({ 
                        status: 200, 
                        message: `You sent the same password`, 
                        data: null
                    });
                }
    
                let bcryptedPassword = await bcrypt.hash(req.body.password, 8);
    
                delete req.body.oldpassword;
                req.body.password = bcryptedPassword;
                
                await database.updateUser(req.user.id, req.body);
                return res.status(200).json({ status: 200, message: "success", data: null});
    
            } else {
                await database.updateUser(req.user.id, req.body);
                return res.status(200).json({ status: 200, message: "success", data: null});
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async deleteUser(req, res){
        try {
            let user = await database.getUser(req.user.id);
    
            if(!user){
                return res.status(404).json({ status: 404, message: `User not found!`, data: null});
            }
    
            await database.deleteUser(req.user.id);
            req.session.destroy();
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async restoreUser(req, res){
        try {
            let user = await database.getUser(req.user.id);
    
            if(!user){
                return res.status(404).json({ status: 404, message: `User not found!`, data: null});
            }
    
            await database.restoreUser(req.user.id);
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    async getCount(req, res){
        try {
            let count = await database.getCount();
            return res.status(200).json({ status: 200, message: "success", data: count});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
}

module.exports = new UserAPI();
