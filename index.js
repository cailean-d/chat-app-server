//nodejs modules
const fs = require('fs');                                         // file system
const path = require('path');                                     // path module      
const express = require('express');                               // express framework
const app = require('express')();                                 // express application
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


const privateKey  = fs.readFileSync('./conf/ssl/server.key', 'utf8');
const certificate = fs.readFileSync('./conf/ssl/server.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};

const https = require('https').Server(credentials, app);          // http server
const io = require('socket.io')(https);                           // socket server

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
const passportVKontakte = require('./server/auth/vk');

//custom modules
const api = require('./server/api/_index');
const auth = require('./server/auth/_index');
const authMiddleware = require('./server/middlewares/auth');

//socket modules
const socket = require('./server/socket/global')(io);

//middlewares
app.use(cors())                                                    // allow cors
app.use(bodyParser.json());                                        // post data json
app.use(bodyParser.urlencoded({ extended: false }));               // post data encoded
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 }}));    // file upload mw
app.use(device.capture());                                         // user device type info
app.use(useragent.express());                                      // user browser info
app.use(requestIp.mw())                                            // user ip info
app.use(cookieParser(config.auth.session.secret))                  // parse cookie
app.use(session(sessionConfig(session)));                          // app sessions
app.use(passport.initialize());                                    // init auth
app.use(passport.session());                                       // auth session config
app.use(express.static(config.client_root));                       // static dir
app.use('/auth', auth);                                            // aut
app.use('/api', authMiddleware);                                   // auth is required for api
app.use('/api', api);                                              // include server api


//send index file from all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, config.client_root + 'index.html'));
});
  

// connect to database
mongoose.Promise = require('bluebird');
mongoose.connect(dbConfig, (err) => {
    if (err) throw err;
    console.log(`connected to ${dbConfig}`.cyan);
});


//start server
https.listen((process.env.PORT || '3000'), () => {
   console.log(`Server running on https://localhost:${https.address().port}`.green);
});


// redirect http to https
const http = express();
http.get('*', (req, res) => {  
    res.redirect('https://' + req.headers.host + ':3000' + req.url);
});
http.listen(80);

