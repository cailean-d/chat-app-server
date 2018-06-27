const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const database = mongoose.connection;

const confirmSchema = new Schema({
    user_id: {
        type: String, 
        required: true
    },
    hash: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = database.model('confirm', confirmSchema);