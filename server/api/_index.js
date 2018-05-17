const express = require('express');
const router = express.Router();

// api import
const users = require('./users');
const upload = require('./upload');
const friends = require('./friends');
const messages = require('./messages');
const rooms = require('./rooms');

// user api
router.get('/users', users.getUsers);
router.get('/users/count', users.getCount);
router.get('/users/me', users.getMyProfile);
router.get('/users/:id', users.getUser);
router.put('/users', users.updateUser);
router.put('/users/restore', users.restoreUser);
router.delete('/users', users.deleteUser);

// upload api
router.post('/upload/avatar', upload.uploadAvatar);
router.post('/upload/room/:room', upload.uploadRoomImage);

// invites api
router.get('/invites', friends.getInvites);
router.get('/invites/count', friends.getInvitesCount);
router.get('/invites/me', friends.getMyInvites);
router.get('/invites/me/count', friends.getMyInvitesCount);
router.get('/invites/isinvited/me/:id', friends.meIsInvited);
router.get('/invites/isinvited/:id', friends.isInvited);
router.post('/invites/:id', friends.inviteFriend);
router.delete('/invites/:id', friends.rejectFriend);
router.delete('/invites/me/:id', friends.cancelInvite);

//friends api
router.get('/friends', friends.getFriends);
router.get('friends/count', friends.getFriendsCount);
router.get('/friends/isfriend/:id', friends.isFriend);
router.post('/friends/:id', friends.addFriend);
router.delete('/friends/:id', friends.deleteFriend);

//favorite api
router.get('/favorite', users.getFavorite);
router.post('/favorite/:id', users.addFavorite);
router.delete('/favorite/:id', users.deleteFavorite);

// rooms api
router.post('/rooms/open/:user', rooms.openRoom);
router.get('/rooms', rooms.getRooms);
router.get('/rooms/:room', rooms.getRoom);
router.get('/rooms/:room/users', rooms.getUsersFromRoom);
router.get('/rooms/:room/owner', rooms.getOwner);
router.post('/rooms/:room/:user', rooms.addUserToRoom);
router.delete('/rooms/:room', rooms.deleteRoom);
router.delete('/rooms/:room/:user', rooms.deleteUserFromRoom);

// messages api
router.get('/messages/:room', messages.getMessages);
router.get('/messages/:room/:message_id', messages.getMessage);
router.post('/messages/:room', messages.addMessage);
router.put('/messages/:room/:message_id', messages.readMessage);
router.delete('/messages/:room/:message_id', messages.deleteMessage);
router.delete('/messages/:room/:message_id/hide', messages.hideMessage);


router.all('**', (req, res) => res.status(404).json({ status: 404, message: 'API not found', data: null}));


module.exports = router;