var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true , ref: 'Users'},
    language: { type: String, default: 'en' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Settings = mongoose.model('Settings', schema);

module.exports = Settings;