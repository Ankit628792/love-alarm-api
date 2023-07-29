
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    mobile: { type: String, trim: true },
    message: { type: String, trim: true },
    active: { type: Boolean, default: true }
}, { timestamps: true });

const Contacts = mongoose.model('Contacts', schema);

module.exports = Contacts;
