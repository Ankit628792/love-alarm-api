
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    active: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }],
        required: true
    },
    match: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Matches' }
}, { timestamps: true });

const Conversations = mongoose.model('Conversations', schema);

module.exports = Conversations;
