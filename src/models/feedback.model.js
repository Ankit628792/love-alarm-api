
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, required: true , ref: 'Users'},
    comment: { type: String, trim: true },
    category: { type: String, enum: ['suggestion', 'feedback', 'other'] },
    active: { type: Boolean, default: true }
}, { timestamps: true });

const Feedbacks = mongoose.model('Feedbacks', schema);

module.exports = Feedbacks;
