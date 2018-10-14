const fs = require('fs');
const path = require('path');
const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const User  = require('./../database/users');
const bcrypt = require('bcryptjs'); 
const config = JSON.parse(fs.readFileSync(path.join(__dirname, './../../conf/config.json'), 'utf-8'));
const mail_check = config.check_email_activation;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    try {
        const user = await User.getUserByEmail(req.body.email);
        if (!user) { return done(null, false, {message: 'Incorrect email'}); }
        if (mail_check && !user.active) { return done(null, false, {message: 'Verify your email'}); }
        let comparePassword = await bcrypt.compare(req.body.password, user.password);
        if(!comparePassword){ return done(null, false, {message: 'Incorrect password'}); }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
  }));
