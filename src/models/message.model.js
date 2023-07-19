var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    message: { type: String, trim: true, required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Conversations' },
    active: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }],
        required: true,
        default: []
    },
}, { timestamps: true });

const Messages = mongoose.model('Messages', schema);

module.exports = Messages;