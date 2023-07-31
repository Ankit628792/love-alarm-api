var jsonwebtoken = require('jsonwebtoken')
var bcrypt = require('bcryptjs');
var envs = require('../config/env')
const cloudinary = require('cloudinary').v2;
var messagebird = require('messagebird');
messagebird = messagebird(envs.BIRD_API_KEY)


const stripe = require('stripe')(envs.STRIPE_SECRET)

var controller = {}

// Configure Cloudinary
cloudinary.config({
    cloud_name: envs.CLOUDINARY_CLOUD_NAME,
    api_key: envs.CLOUDINARY_API_KEY,
    api_secret: envs.CLOUDINARY_API_SECRET
});

function sendMessageBird({ message, mobile }) {

    var params = {
        'originator': envs.BIRD_ORIGINATOR,
        'recipients': [
            mobile
        ],
        'body': message
    };

    messagebird.messages.create(params, function (err, response) {
        if (err) {
            return console.log(err);
        }
        console.log(response);
    });
}


function encryptString(string) {
    return bcrypt.hashSync(string, envs.BCRYPT_SALT);
}

function compareEncryptedString(string, hash) {
    return bcrypt.compareSync(string, hash);
}

function createAccessToken(payload) {
    return jsonwebtoken.sign(payload, envs.JWT_ACCESS_TOKEN_PRIVATE_KEY, { issuer: envs.JWT_ISSUER, audience: envs.JWT_ACCESS_TOKEN_AUDIENCE, expiresIn: envs.JWT_ACCESS_TOKEN_EXPIRE })
}

function validateToken(token) {
    let payload = null
    try {
        payload = jsonwebtoken.verify(token, envs.JWT_ACCESS_TOKEN_PRIVATE_KEY, { issuer: envs.JWT_ISSUER, audience: envs.JWT_ACCESS_TOKEN_AUDIENCE, ignoreExpiration: true })
    } catch (catchError) {
        payload = null
    }
    return payload
}

function encrypt(message, key) {
    let encryptedMessage = '';
    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        const charCode = char.charCodeAt(0);
        const keyCharCode = key.charCodeAt(i % key.length); // Retrieve the character code of the key at the corresponding position
        const encryptedCharCode = (charCode + keyCharCode) % 256; // Perform simple shift using the key value
        const encryptedChar = String.fromCharCode(encryptedCharCode);
        encryptedMessage += encryptedChar;
    }
    return encryptedMessage;
}

function decrypt(encryptedMessage, key) {
    let decryptedMessage = '';
    for (let i = 0; i < encryptedMessage.length; i++) {
        const char = encryptedMessage[i];
        const charCode = char.charCodeAt(0);
        const keyCharCode = key.charCodeAt(i % key.length); // Retrieve the character code of the key at the corresponding position
        const decryptedCharCode = (charCode - keyCharCode + 256) % 256; // Reverse the shift using the key value
        const decryptedChar = String.fromCharCode(decryptedCharCode);
        decryptedMessage += decryptedChar;
    }
    return decryptedMessage;
}


controller.createAccessToken = createAccessToken
controller.validateToken = validateToken
controller.encryptString = encryptString
controller.compareEncryptedString = compareEncryptedString
controller.encrypt = encrypt
controller.decrypt = decrypt
controller.cloudinary = cloudinary
controller.stripe = stripe
controller.sendMessageBird = sendMessageBird

module.exports = controller