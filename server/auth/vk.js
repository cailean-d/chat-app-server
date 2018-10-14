const passport       = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const User  = require('./../database/users');
const config = require('./../../conf/oauth');

passport.use(new VKontakteStrategy(
    {
      clientID: config.vk.id,
      clientSecret: config.vk.secret,
      callbackURL: config.vk.callback,
    },
    function(accessToken, refreshToken, params, profile, done) {
        User.findOrCreate(profile, function(err, user) {
            return done(err, user);
        });
    }
  ));
  