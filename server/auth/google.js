const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User  = require('./../database/users');
const config = require('./../../conf/oauth');

passport.use(new GoogleStrategy({
    clientID: config.google.id,
    clientSecret: config.google.secret,
    callbackURL: "https://localhost:3000/auth/login/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate(profile, function (err, user) {
      return cb(err, user);
    });
  }
));
