const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const User  = require('./../database/users');
const bcrypt = require('bcryptjs'); 

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
        const user = await User.getUserByEmail(username);
        if (!user) { return done(null, false, {message: 'Incorrect email'}); }
        let comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){ return done(null, false, {message: 'Incorrect password'}); }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
  }));
