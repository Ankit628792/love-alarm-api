var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    planType: { type: String, enum: ['free', 'referral', 'coupon', 'subscription'], required: true },
    noOfDays: { type: Number },
    colors: {
        type: [String],
        default: ['#FFFFFF', '#FFFFFF'],
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Plans = mongoose.model('Plans', schema);

module.exports = Plans;