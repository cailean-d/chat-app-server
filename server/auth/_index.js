const express = require('express');
const router = express.Router();
const auth = require('./auth');
const passport = require('passport');

router.post('/reg', auth.registerUser);
router.post('/login/local', auth.localAuth,  auth.localAuthCallback);
router.get('/login/google', auth.googleAuth);
router.get('/login/google/callback', auth.googleAuth, auth.googleAuthCallback);
router.get('/login/facebook', auth.facebookAuth);
router.get('/login/facebook/callback', auth.facebookAuth, auth.facebookAuthCallback);

router.delete('/logout', auth.logoutUser);
router.get('/check', auth.checkAuth);

router.all('**', (req, res) => res.status(404).json({ status: 404, message: 'API not found', data: null}));

module.exports = router;