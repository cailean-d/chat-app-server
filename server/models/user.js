const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

let Schema = mongoose.Schema;
let database = mongoose.connection;

autoIncrement.initialize(database);

const userSchema = new Schema({
    nickname: {
        type: String, 
        required: true, 
        unique: "nickname already exists"
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
    status: {
        type: String, 
        default: 'offile'
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
    rooms: {
        type: Array, 
        default: null
    },
    deleted: {
        type: Boolean, 
        default: false
    },
    date: {
        type: Date, 
        required: true,
        default: Date.now
    }
});

userSchema.plugin(autoIncrement.plugin, { model: 'users', field: 'id',  startAt: 1 });

module.exports = database.model('users', userSchema);
 