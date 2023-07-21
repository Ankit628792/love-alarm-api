
// Stripe based schema
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'], required: true },
    paymentFor: { type: String, enum: ['subscription', 'referral'], required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plans', required: true },
    paymentAmount: { type: Number, required: true },
    paymentCurrency: { type: String, required: true },

    paymentMethod: { type: String },
    payment_method_details: { type: Object },
    paymentIntentId: { type: String },
    paymentSuccessId: { type: String },
    receipt: { type: String },

    validUpto: { type: Date },

    metadata: { type: Object }
}, { timestamps: true });

const Orders = mongoose.model('Orders', schema);

module.exports = Orders


// Razorpay based schema 
// var mongoose = require('mongoose');

// var schema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
//     status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'], required: true },
//     paymentFor: { type: String, enum: ['subscription', 'referral'], required: true },
//     plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plans', required: true },
//     paymentAmount: { type: Number, required: true },
//     paymentCurrency: { type: String, required: true },

//     paymentMethod: { type: String },
//     orderId: { type: String },
//     paymentId: { type: String },
//     email: { type: String },
//     contact: { type: String },

//     validUpto: { type: Date },

//     metadata: { type: Object }
// }, { timestamps: true });

// const Orders = mongoose.model('Orders', schema);

// module.exports = Orders