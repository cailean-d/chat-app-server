const fs = require('fs');     
const path = require('path');
const jwt = require('jsonwebtoken');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../conf/config.json'), 'utf-8'));


module.exports = function(req, res, next) {

    if(config.auth.type == 'session'){
        if(req.session.logined){
            next()
        } else {
            res.status(401).json({ status: 401, message: `Authentication is required`});
        }
    } else if (config.auth.type == 'jwt'){
        if(req.headers && req.headers.authorization){
            jwt.verify(req.headers.authorization, config.auth.jwt.secret, function(err, decoded) {
               if (err){
                   console.log(err);
                   res.status(401).json({ status: 401, message: `Authentication failed`});
               } else {
                   next()
               }
              }); 
        } else{
            res.status(401).json({ status: 401, message: `Authentication is required`});
        }
    }

}