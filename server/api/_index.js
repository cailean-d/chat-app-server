const express = require('express');
const router = express.Router();

// api import
const users = require('./users');
const upload = require('./upload');
const friends = require('./friends');
const messages = require('./messages');
const rooms = require('./rooms');

// user api
router.get('/users', (req, res) => {users.getUsers(req, res)});
router.get('/users/count', (req, res) => {users.getCount(req, res)})
router.get('/users/me', (req, res) => {users.getMyProfile(req, res)})
router.get('/users/:id', (req, res) => {users.getUser(req, res)});
router.put('/users', (req, res) => {users.updateUser(req, res)});
router.put('/users/restore', (req, res) => {users.restoreUser(req, res)});
router.delete('/users', (req, res) => {users.deleteUser(req, res)});

// upload api
router.post('/upload/avatar', (req, res) => {upload.uploadAvatar(req, res)});
router.post('/upload/room/:room', (req, res) => {upload.uploadRoomImage(req, res)});

// invites api
router.get('/invites', (req, res) => {friends.getInvites(req, res)});
router.get('/invites/count', (req, res) => {friends.getInvitesCount(req, res)});
router.get('/invites/me', (req, res) => {friends.getMyInvites(req, res)});
router.get('/invites/me/count', (req, res) => {friends.getMyInvitesCount(req, res)});
router.get('/invites/isinvited/me/:id', (req, res) => {friends.meIsInvited(req, res)});
router.get('/invites/isinvited/:id', (req, res) => {friends.isInvited(req, res)});
router.post('/invites/:id', (req, res) => {friends.inviteFriend(req, res)});
router.delete('/invites/:id', (req, res) => {friends.rejectFriend(req, res)});
router.delete('/invites/me/:id', (req, res) => {friends.cancelInvite(req, res)});

//friends api
router.get('/friends', (req, res) => {friends.getFriends(req, res)});
router.get('friends/count', (req, res) => {friends.getFriendsCount(req, res)});
router.get('/friends/isfriend/:id', (req, res) => {friends.isFriend(req, res)});
router.post('/friends/:id', (req, res) => {friends.addFriend(req, res)});
router.delete('/friends/:id', (req, res) => {friends.deleteFriend(req, res)});

// rooms api
router.post('/rooms/open/:user', (req, res) => {rooms.openRoom(req, res)});
router.get('/rooms', (req, res) => {rooms.getRooms(req, res)});
router.get('/rooms/:room', (req, res) => {rooms.getRoom(req, res)});
router.get('/rooms/:room/users', (req, res) => {rooms.getUsersFromRoom(req, res)});
router.get('/rooms/:room/owner', (req, res) => {rooms.getOwner(req, res)});
router.post('/rooms/:room/:user', (req, res) => {rooms.addUserToRoom(req, res)});
router.delete('/rooms/:room', (req, res) => {rooms.deleteRoom(req, res)});
router.delete('/rooms/:room/:user', (req, res) => {rooms.deleteUserFromRoom(req, res)});

// messages api
router.get('/messages/:room', (req, res) => {messages.getMessages(req, res)});
router.get('/messages/:room/:message_id', (req, res) => {messages.getMessage(req, res)});
router.post('/messages/:room', (req, res) => {messages.addMessage(req, res)});
router.put('/messages/:room/:message_id', (req, res) => {messages.readMessage(req, res)});
router.delete('/messages/:room/:message_id', (req, res) => {messages.deleteMessage(req, res)});
router.delete('/messages/:room/:message_id/hide', (req, res) => {messages.hideMessage(req, res)});




module.exports = router;