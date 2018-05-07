const passport       = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User  = require('./../database/users');
const config = require('./../../conf/facebook');

passport.use(new FacebookStrategy({
    clientID: config.id,
    clientSecret: config.secret,
    callbackURL: "http://localhost:3000/auth/login/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreateFacebook(profile, function(err, user) {
      return done(err, user);
    });
  }
));