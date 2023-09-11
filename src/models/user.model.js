var mongoose = require('mongoose');
const { AES } = require('crypto-js')

function hasNumber(v) {
    return v.length && /\d/.test(v);
}

var schema = new mongoose.Schema({
    status: { type: String, default: 'pending', enum: ['active', 'blocked', 'pending'], required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plans', required: true },
    setting: {
        language: { type: String },
        isActive: { type: Boolean, default: true }
    },
    currency: { type: String, default: 'USD' },
    country: { type: String },
    email: { type: String, trim: true, lowercase: true },
    mobile: { type: String, trim: true, unique: true, validate: hasNumber },
    name: { type: String, trim: true },
    gender: { type: String, trim: true, lowercase: true, enum: ['male', 'female', 'transgender'] },
    image: { type: String, trim: true },
    interestedIn: { type: String, trim: true, lowercase: true, enum: ['male', 'female', 'transgender'] },
    age: { type: Number, default: 0 },
    dateOfBirth: { type: mongoose.Schema.Types.Date },
    onboardStep: { type: Number, default: 1, min: 1 },
    heartId: { type: String, required: true },
    fcmToken: { type: String },
    referralCode: { type: String },
    referred: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false }], default: [] },
    blockedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        default: []
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0], // [longitude, latitude]
        },
    },

}, { timestamps: true });

schema.index({ location: '2dsphere' });


// // Pre-save middleware
// schema.pre('save', async function (next) {

//     if (this.heartId) {
//         const secretKey = this.heartId;

//         // Encrypt the sensitive data if it is being modified or is new
//         if (this.isModified('email') || this.isNew) {
//             try {
//                 this.email = AES.encrypt(this.email, secretKey).toString();
//             } catch (error) {
//                 return next(error);
//             }
//         }
//         if (this.isModified('mobile') || this.isNew) {
//             try {
//                 this.mobile = AES.encrypt(this.mobile, secretKey).toString();
//             } catch (error) {
//                 return next(error);
//             }
//         }
//         if (this.isModified('name') || this.isNew) {
//             try {
//                 this.name = AES.encrypt(this.name, secretKey).toString();
//             } catch (error) {
//                 return next(error);
//             }
//         }
//         if (this.isModified('image') || this.isNew) {
//             try {
//                 this.image = AES.encrypt(this.image, secretKey).toString();
//             } catch (error) {
//                 return next(error);
//             }
//         }
//     }
//     next();
// });

// Pre-validate middleware
schema.pre('validate', async function (next) {
    next();
});

const Users = mongoose.model('Users', schema);

module.exports = Users
