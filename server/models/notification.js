const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;
const database = mongoose.connection;

autoIncrement.initialize(database);

const notificationSchema = new Schema({
    user_id: {
        type: String, 
        required: true
    },
    message: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

notificationSchema.plugin(autoIncrement.plugin, { model: 'notification', field: 'id',  startAt: 1 });

module.exports = database.model('notification', notificationSchema);