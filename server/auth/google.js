const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User  = require('./../database/users');
const config = require('./../../conf/google');

passport.use(new GoogleStrategy({
    clientID: config.id,
    clientSecret: config.secret,
    callbackURL: "http://localhost:3000/auth/login/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate(profile, function (err, user) {
      return cb(err, user);
    });
  }
));
