var mongoose = require('mongoose');
const { AES } = require('crypto-js');

var schema = new mongoose.Schema({
    mobile: { type: String, trim: true, required: true },
    otp: { type: String, trim: true, required: true },
    realOTP: { type: String, trim: true, required: true }, // remove in production
    isExpired: { type: Boolean, default: false }
}, { timestamps: true });

const OTPs = mongoose.model('OTPs', schema);

module.exports = OTPs;


// Pre-save middleware
// schema.pre('save', async function (next) {

//     // Encrypt the sensitive data if it is being modified or is new
//     if (this.isModified('otp') || this.isNew) {
//         try {
//             this.otp = AES.encrypt(this.otp, this.otp).toString();
//         } catch (error) {
//             return next(error);
//         }
//     }
//     if (this.isModified('mobile') || this.isNew) {
//         try {
//             this.mobile = AES.encrypt(this.mobile, this.mobile).toString();
//         } catch (error) {
//             return next(error);
//         }
//     }
//     next();
// });
