const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User  = require('./../database/users');
const config = require('./../../conf/oauth');

passport.use(new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret: config.facebook.secret,
    callbackURL: "https://localhost:3000/auth/login/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(profile, function(err, user) {
      return done(err, user);
    });
  }
));