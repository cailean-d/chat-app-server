const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;
const database = mongoose.connection;

autoIncrement.initialize(database);

const roomSchema = new Schema({
    title: {
        type: String,
        default: null
    },
    pic: {
        type: String,
        default: 'room.png'
    },
    owner: {
        type: String, 
        required: true
    },
    users: {
        type: Array, 
        required: true
    },
    date: {
        type: Date, 
        required: true,
        default: Date.now
    }
});

roomSchema.plugin(autoIncrement.plugin, { model: 'rooms', field: 'id',  startAt: 1 });

module.exports = database.model('rooms', roomSchema);