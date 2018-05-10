const passport       = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User  = require('./../database/users');
const config = require('./../../conf/twitter');

passport.use(new TwitterStrategy({
    consumerKey: config.id,
    consumerSecret: config.secret,
    callbackURL: "http://localhost:3000/auth/login/twitter/callback",
    userProfileURL  : 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'
  },
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate(profile, function(err, user) {
        return cb(err, user);
    });
  }
));