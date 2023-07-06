
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    users: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }],
        required: true
    },
}, { timestamps: true });

const Matches = mongoose.model('Matches', schema);

module.exports = Matches;
