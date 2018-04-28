const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const database = mongoose.connection;

const friendSchema = new Schema({
    friend_1: {
        type: String, 
        required: true
    },
    friend_2: {
        type: String, 
        required: true
    },
    status: {
        type: String, 
        required: true,
        default: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = database.model('friends', friendSchema);