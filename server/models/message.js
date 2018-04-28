const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;
const database = mongoose.connection;

autoIncrement.initialize(database);

const messageSchema = new Schema({
    sender: {
        type: Number, 
        required: true
    },
    message: {
        type: String, 
        required: true
    },
    room: {
        type: Number, 
        required: true
    },
    status: {
        type: Number, 
        required: true,
        default: 0
    },
    hidden: {
        type: Array
    },
    date: {
        type: Date, 
        required: true,
        default: Date.now
    }
});

messageSchema.plugin(autoIncrement.plugin, { model: 'messages', field: 'id',  startAt: 1 });

module.exports = database.model('messages', messageSchema);