const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.post('/reg', auth.registerUser);
router.post('/login/local', auth.loginUser);
router.post('/logout', auth.logoutUser);
router.post('/check', auth.checkAuth);

module.exports = router;