
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    category: { type: String, enum: ['block', 'report'] },
    reason: { type: String },
    active: { type: Boolean, default: true }
}, { timestamps: true });

const Reports = mongoose.model('Reports', schema);

module.exports = Reports;
