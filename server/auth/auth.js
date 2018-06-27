const database = require('../database/users');
const confirmDB = require('../database/confirm');
const userinfo = require('../middlewares/userinfo');
const bcrypt = require('bcryptjs');       
const passport = require('passport');
const nodemailer = require("nodemailer");
const uniqid = require('uniqid');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: 'chat.application.dl@gmail.com', 
        pass: '123smoke456' 
    }
});


function sendMail(userid, address) {

    let hash = uniqid();

    let mailOptions = {
        from: '"Chat Application"', 
        to: address, 
        subject: 'Подтверждение регистрации', 
        text: `Для завершения регистрации перейдите по ссылке https://app.cailean.ga/authe/confirm/${hash}`, 
        html: `Для завершения регистрации перейдите по ссылке <a href="https://app.cailean.ga/authe/confirm/${hash}">https://app.cailean.ga/authe/confirm/${hash}</a>` 
    };

    confirmDB.addHash(userid, hash);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });

}



class AuthAPI {

    async registerUser(req, res){
    
        try {

            if(!req.body.nickname){
                return res.status(400).json({ status: 400, message: '-nickname- is required'}); 
            }
    
            if(!/^[A-Za-zА-Яа-я\s-_]+[0-9]*$/.test(req.body.nickname)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-nickname- must contain only letters, numbers and -_",
                    data: null
                }); 
            }
    
            if(req.body.nickname && (req.body.nickname.length < 3 && req.body.nickname.length > 30)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-nickname- 's length must be more than 3 and less than 30",
                    data: null
                }); 
            }
    
            if (!req.body.email){
                return res.status(400).json({ status: 400, message: 'Email is required'}); 
            }
    
            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-email- incorrect value",
                    data: null
                }); 
            }
    
            if (!req.body.password){
                return  res.status(400).json({ status: 400, message: 'Password is required'}); 
            }

    
            if(req.body.password.length < 6 || req.body.password.length > 30){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-password- 's length must be more than 6 and less than 30",
                    data: null
                }); 
            }
    
            let bcryptedPassword = await bcrypt.hash(req.body.password, 8);
            let newUser = await database.registerUser(req.body.nickname, req.body.email, bcryptedPassword);
    
            await database.updateUser(newUser.id, {status: 'online'});

            sendMail(newUser.id, req.body.email);

            return res.status(200).json({ status: 200, message: "success", data: null});

    
        } catch (error) {
            if(error.code === 11000){
                res.status(400).json({ 
                    status: 400, 
                    message: "Email already exists", 
                    data: null
                }); 
            } else {
                console.log(error);
                res.status(400).json({ 
                    status: 400, 
                    message: err.message,
                    data: null
                });
            }
        }
    }
    
    logoutUser(req, res){
        try {
            if(!req.isAuthenticated()){
                return res.status(400).json({ 
                    status: 400, 
                    message: "You are not logined", 
                    data: null
                });
            }
    
            req.logout();
            return res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
    checkAuth(req, res){
        try {
    
            if(req.isAuthenticated()){
                return res.status(200).json({ status: 200, message: "success", data: true});
            } else {
                return res.status(200).json({ status: 200, message: "success", data: false});
            }
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }

    localAuth(req, res, next) {

        if(req.isAuthenticated()){
            return res.status(400).json({ 
                status: 400, 
                message: "You are already logined",
                data: null
            });
        }

        if(!req.body.email){
            return res.status(400).json({ 
                status: 400, 
                message: '-email- is required',
                data: null
            }); 
        }

        if(!req.body.password){
            return res.status(400).json({ 
                status: 400, 
                message: '-password- is required',
                data: null
            }); 
        }

        passport.authenticate('local', function(err, user, info) {
    
            if (err) { return next(err) }
    
            if (!user) {
                return res.status(400).json({ 
                    status: 400, 
                    message: info.message,
                    data: null
                });
            }
    
            req.logIn(user, function(err) {
            if (err) { return next(err); }
                req.user = user;
                next();
            });
    
        })(req, res, next);
    }

    authCallback(req, res, next) {
        res.redirect('/');
    }

    authLocalCallback(req, res, next) {
        return res.status(200).json({ 
            status: 200, 
            message: "success",
            data: req.user
        });
    }
 
    googleAuth(req, res, next) {

        if(req.isAuthenticated()){
            return res.status(400).json({ 
                status: 400, 
                message: "You are already logined",
                data: null
            });
        }

        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    }

    facebookAuth(req, res, next){

        if(req.isAuthenticated()){
            return res.status(400).json({ 
                status: 400, 
                message: "You are already logined",
                data: null
            });
        }

        passport.authenticate('facebook', { scope : ['email'] })(req, res, next);
    }

    twitterAuth(req, res, next) {

        if(req.isAuthenticated()){
            return res.status(400).json({ 
                status: 400, 
                message: "You are already logined",
                data: null
            });
        }

        passport.authenticate('twitter')(req, res, next);

    }

    vkAuth(req, res, next) {
        
        if(req.isAuthenticated()){
            return res.status(400).json({ 
                status: 400, 
                message: "You are already logined",
                data: null
            });
        }

        passport.authenticate('vkontakte')(req, res, next);

    }

    async confirmAccount(req, res) {

        try {

            if(!req.params.hash){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-hash- is required',
                    data: null
                }); 
            }

            let record = confirmDB.getHash(req.params.hash);

            if (record) {
                await database.updateUser(record.user_id, {active: true});
                await confirmDB.deleteHash(record.user_id);
                return res.status(200).json({ status: 200, message: "success", data: null});
            } else {
                return res.status(400).json({ 
                    status: 400, 
                    message: "record does not exist",
                    data: null
                }); 
            }


        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null});
        }

    }

}

module.exports = new AuthAPI();

