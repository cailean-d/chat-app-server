const fs = require('fs'); 
const path = require('path');     
const config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json'), 'utf-8'));
const RedisStore = require('connect-redis');  

module.exports = function(session){

      const Store = RedisStore(session);
      const sessionStore = new Store({
            host: config.auth.session.store.redis.host,
            port: Number(config.auth.session.store.redis.port),
            ttl: Number(config.auth.session.maxAgeServer) * 86400
      })
      
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