//nodejs modules
const fs = require('fs');                                         // file system
const path = require('path');                                     // path module      
const express = require('express');                               // express framework
const app = require('express')();                                 // express application
const http = require('http').Server(app);                         // http server
const io = require('socket.io')(http);                            // socket server
const bodyParser = require('body-parser')                         // x-www-form-urlencoded
const fileUpload = require('express-fileupload');                 // file upload
const session = require('express-session')                        // session for express
const cookieParser = require('cookie-parser')                     // cookie parser
const mongoose = require('mongoose');                             // mongodb driver
const device = require('express-device');                         // user device type info
const useragent = require('express-useragent');                   // user browser info
const requestIp = require('request-ip');                          // request ip
const cors = require('cors')
const colors = require('colors');

// configs
const config = JSON.parse(fs.readFileSync('./conf/config.json', 'utf-8'));
const dbConfig = require('./conf/database');
const sessionConfig = require('./conf/session');

// passport auth
const passport = require('./conf/passport');
const passportLocal = require('./server/auth/local');
const passportGoogle = require('./server/auth/google');
const passportFacebook = require('./server/auth/facebook');
const passportTwitter = require('./server/auth/twitter');

//custom modules
const api = require('./server/api/_index');
const auth = require('./server/auth/_index');
const authMiddleware = require('./server/middlewares/auth');

//socket namespaces
let global = io;
let friends = io.of('/friends');
let general_chat = io.of('/general_chat');

//socket modules
let global_socket = require('./server/socket/global')(global);
// let socket_general_chat = require('./server/socket/general_chat')(global);
// let socket_friends      = require('./server/socket/friends')(friends, global);

//middlewares
app.use(cors())                                                    // allow cors
app.use(bodyParser.json());                                        // post data json
app.use(bodyParser.urlencoded({ extended: false }));               // post data encoded
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }}));    // file upload mw
app.use(device.capture());                                         // user device type info
app.use(useragent.express());                                      // user browser info
app.use(requestIp.mw())                                            // user ip info
app.use(cookieParser(config.auth.session.secret))                  // parse cookie
app.use(session(sessionConfig(session)));                          // app sessions
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('client'));                                 // static dir
app.use('/auth', auth);                                            // aut
app.use('/api', authMiddleware);                                   // auth is required for api
app.use('/api', api);                                              // include server api


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
  
//send index file from all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});
  

// connect to database
mongoose.Promise = require('bluebird');
mongoose.connect(dbConfig, function(err) {
    if (err) throw err;
    console.log(`connected to ${dbConfig}`.cyan);
});


//start server
http.listen((process.env.PORT || '3000'), () => {
   console.log(`Server running on localhost:${http.address().port}`.green)
});

