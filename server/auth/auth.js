const express = require('express');
const router = express.Router();
const database = require('../database/users');
const userinfo = require('../middlewares/userinfo');
const bcrypt = require('bcryptjs');       
const jwt = require('jsonwebtoken');
const fs = require('fs');     
const path = require('path');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../conf/config.json'), 'utf-8'));

router.post('/reg', (req, res) => {registerUser(req, res)})
router.post('/login', (req, res) => {loginUser(req, res)})
router.post('/logout', (req, res) => {logoutUser(req, res)})
router.post('/check', (req, res) => {checkAuth(req, res)})

module.exports = router;

//=============================================================================
//=============================================================================

async function loginUser(req, res){
    try {
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

        if(req.session.logined){
            return res.status(400).json({ 
                status: 400, 
                message: "You are already logined",
                data: null
            });
        }

        let user = await database.getUserByEmail(req.body.email);

        if(!user){
            return res.status(400).json({ 
                status: 400, 
                message: `The email does not exists!`,
                data: null
            });
        }

        let comparePassword = await bcrypt.compare(req.body.password, user.password);

        if(!comparePassword){
            return res.status(400).json({ 
                status: 400, 
                message: `Incorrect password`,
                data: null
            });
        }

        if(config.auth.type == 'session'){
            await database.updateUser(user.id, {status: 'online'})
            createSession(req, res, user);
        } else if (config.auth.type == 'jwt'){
            createJWT(req, res, user);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null}); 
    }
}

async function registerUser(req, res){

    try {
        if(!req.body.nickname){
            return res.status(400).json({ status: 400, message: 'Nickname is required'}); 
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

        if (!req.body.email){
            return res.status(400).json({ status: 400, message: 'Email is required'}); 
        }

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)){
            return res.status(400).json({ 
                status: 400, 
                message: "-email- incorrect email",
                data: null
            }); 
        }

        if (!req.body.password){
            return  res.status(400).json({ status: 400, message: 'Password is required'}); 
        }

        if(req.body.password.length < 6 && req.body.password.length > 50){
            return res.status(400).json({ 
                status: 400, 
                message: "-password- 's length must be more then 6 and less then 50",
                data: null
            }); 
        }

        let bcryptedPassword = await bcrypt.hash(req.body.password, 8);
        let newUser = await database.registerUser(req.body.nickname, req.body.email, bcryptedPassword);

        await database.updateUser(newUser.id, {status: 'online'});
        
        if(config.auth.type == 'session'){
            createSession(req, res, newUser);
        } else if (config.auth.type == 'jwt'){
            createJWT(req, res, newUser);
        }

    } catch (error) {
        console.log(error);
        if(error.code === 11000){
            res.status(400).json({ 
                status: 400, 
                message: "Email or Nickname already exists", 
                data: null
            }); 
        } else {
            res.status(400).json({ 
                status: 400, 
                message: err.message,
                data: null
            });
        }
    }
}

async function logoutUser(req, res){
    try {
        if(!req.session.logined){
            return res.status(400).json({ 
                status: 400, 
                message: "You are not logined", 
                data: null
            });
        }

        await database.updateUser(req.session.userid, {status: 'offline'});
        req.session.destroy();
        return res.status(200).json({ status: 200, message: "success", data: null});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null}); 
    }
}

async function checkAuth(req, res){
    try {
        if(config.auth.type == 'session'){
            if(req.session.logined){
                return res.status(200).json({ status: 200, message: "success", data: true});
            } else {
                return res.status(401).json({ status: 401, message: "success", data: false});
            }
        } else if (config.auth.type == 'jwt'){
            if(req.headers && req.headers.authorization){
                let verify = await jwt.verify(req.headers.authorization, config.auth.jwt.secret);

                if(verify){
                    return res.status(200).json({ status: 200, message: "success", data: true});
                } else {
                    return res.status(401).json({ status: 401, message: "success", data: false});
                }

            } else{
                res.status(401).json({ status: 401, message: "success", data: false});
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null}); 
    }
}

function createSession(req, res, doc){
    req.session.logined = true;
    req.session.userid = doc.id;
    req.session.firstname = doc.firstname;
    req.session.lastname = doc.lastname;
    req.session.userinfo = userinfo(req);
    return res.status(200).json({ status: 200, type: 'session', message: "success", data: null});
}

async function createJWT(req, res, doc){
    try {
        let signToken = await jwt.sign({
            logined : true,
            userid : doc.id,
            firstname : doc.firstname,
            lastname : doc.lastname,
            userinfo : userinfo(req)
           }, config.auth.jwt.secret, 
           { algorithm: config.auth.jwt.algorithm,
             expiresIn: config.auth.jwt.maxAge + 'd'
           });
        return res.status(200).json({ status: 200, type: 'jwt', message: "success", data: token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null}); 
    }
}
