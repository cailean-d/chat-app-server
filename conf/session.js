const fs = require('fs'); 
const path = require('path');     
const mongoose = require('mongoose');                            
const config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json'), 'utf-8'));

let Store, sessionStore, RedisStore, MongoStore;

if(config.auth.session.store.type == "redis"){
      RedisStore = require('connect-redis');  
} else if(config.auth.session.store.type == "mongo"){
      MongoStore = require('connect-mongo');    
}

module.exports = function(session){

      if(config.auth.session.store.type == "redis"){
            Store = RedisStore(session);
            sessionStore = new Store({
                  host: config.auth.session.store.redis.host,
                  port: Number(config.auth.session.store.redis.port),
                  ttl: Number(config.auth.session.maxAgeServer) * 86400
            })
      } else if(config.auth.session.store.type == "mongo"){
            Store = MongoStore(session);
            sessionStore = new Store({ 
                  mongooseConnection: mongoose.connection,
                  ttl: Number(config.auth.session.maxAgeServer) * 86400
            })
      }
      
      let conf = {
            store: sessionStore,
            secret: config.auth.session.secret,
            resave: (config.auth.session.resave === "true"),
            saveUninitialized: (config.auth.session.saveUninitialized === "true"),
            cookie: {
                  maxAge: Number(config.auth.session.maxAgeClient) * 86400000,
                  secure: (config.auth.session.secure === "true")
            }
      }

      return conf;
}