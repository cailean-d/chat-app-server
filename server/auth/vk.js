const passport       = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const User  = require('./../database/users');
const config = require('./../../conf/vk');

passport.use(new VKontakteStrategy(
    {
      clientID: config.id,
      clientSecret: config.secret,
      callbackURL: 'https://localhost:3000/auth/login/vk/callback',
    },
    function(accessToken, refreshToken, params, profile, done) {
        User.findOrCreate(profile, function(err, user) {
            return done(err, user);
        });
    }
  ));
  