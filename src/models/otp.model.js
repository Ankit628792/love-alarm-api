var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    mobile: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    otp: { type: String, trim: true, required: true },
    isExpired: { type: Boolean, default: false }
}, { timestamps: true });

const OTPs = mongoose.model('OTPs', schema);

module.exports = OTPs;
