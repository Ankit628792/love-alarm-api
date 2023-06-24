var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'complete', 'failed'], required: true },
    paymentFor: { type: String, enum: ['subscription'], required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'plans', required: true },
    paymentAmount: { type: Number },
    paymentCurrency: { type: String },
    paymentMode: { type: String },
    referenceId: { type: String },
    validUpto: { type: Date },
    platform: { type: String }
}, { timestamps: true });

const Orders = mongoose.model('Orders', schema);

module.exports = Orders