const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

let Schema = mongoose.Schema;
let database = mongoose.connection;

autoIncrement.initialize(database);

const userSchema = new Schema({
    accountType: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: false
    },
    facebookId: {
        type: String,
        required: false
    },
    twitterId: {
        type: String,
        required: false
    },
    vkId: {
        type: String,
        required: false
    },
    nickname: {
        type: String, 
        required: true 
    },
    email: {
        type: String, 
        required: true, 
        unique : "email already exists"
    },
    password: {
        type: String, 
        required: true
    },
    avatar: {
        type: String, 
        default: '/assets/images/default-user.png'
    },
    gender: {
        type: String, 
        default: null
    },
    birthday: {
        type: Date, 
        default: null
    },
    phone: {
        type: String, 
        default: null
    },
    website: {
        type: String, 
        default: null
    },
    country: {
        type: String, 
        default: null
    },
    city: {
        type: String, 
        default: null
    },
    address: {
        type: String,
        default: null
    },
    language: {
        type: Array, 
        default: null
    },
    favorite: {
        type: Array, 
        default: null
    },
    rooms: {
        type: Array, 
        default: null
    },
    deleted: {
        type: Boolean, 
        default: false
    },
    online: {
        type: String | Number,
        default: null
    },
    date: {
        type: Date, 
        required: true,
        default: Date.now
    }
});

userSchema.plugin(autoIncrement.plugin, { model: 'users', field: 'id',  startAt: 1 });

module.exports = database.model('users', userSchema);
 