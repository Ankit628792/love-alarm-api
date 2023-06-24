var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    planType: { type: String, enum: ['free', 'referral', 'coupon', 'subscription'], required: true },
    noOfDays: { type: Number }
}, { timestamps: true });

const Plans = mongoose.model('Plans', schema);

module.exports = Plans;