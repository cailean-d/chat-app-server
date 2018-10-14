const fs = require('fs');
const path = require('path');
const colors = require('colors');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, './../../conf/config.json'), 'utf-8'));

const redis = cfg.auth.session.store.redis;

module.exports = function (req, res, next) {
    if (!req.session) {
      console.log(`Failed to connect to Redis [ ${redis.host}:${redis.port} ]`.red);
    }
    next();
}