const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.post('/reg', auth.registerUser);
router.post('/login/local', auth.loginUser);
router.delete('/logout', auth.logoutUser);
router.get('/check', auth.checkAuth);
router.all('**', (req, res) => res.status(404).json({ status: 404, message: 'API not found', data: null}));

module.exports = router;