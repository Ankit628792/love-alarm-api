var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    senderVisibility: {
        type: Boolean,
        default: true,
    },
    receiverVisibility: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

const Rings = mongoose.model('Rings', schema);

module.exports = Rings;