
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    icon: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    active: { type: Boolean, default: true }
}, { timestamps: true });

const Notices = mongoose.model('Notices', schema);

module.exports = Notices;
