const express = require('express');
const router = express.Router();
const auth = require('./auth');
const passport = require('passport');

router.post('/reg', auth.registerUser);
router.post('/login/local', auth.localAuth,  auth.authCallback);
router.get('/login/google', auth.googleAuth);
router.get('/login/google/callback', auth.googleAuth, auth.authCallback);
router.get('/login/facebook', auth.facebookAuth);
router.get('/login/facebook/callback', auth.facebookAuth, auth.authCallback);
router.get('/login/twitter', auth.twitterAuth);
router.get('/login/twitter/callback', auth.twitterAuth, auth.authCallback);

router.delete('/logout', auth.logoutUser);
router.get('/check', auth.checkAuth);

router.all('**', (req, res) => res.status(404).json({ status: 404, message: 'API not found', data: null}));

module.exports = router;