var envs = require('../config/env')
var axios = require('axios').default
var commons = {}


function checkConsole(req, type, arrayParams) {
    let data = [
        new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata'
        }),
        type,
        req.logId,
        req.originalUrl,
        req.method,
    ]
    if (type == 'INFO') {
        console.log(data.join(' | '), ...arrayParams)
    } else if (type == 'ERROR') {
        console.error(data.join(' | '), ...arrayParams)
    }
}


function sendOTPSms(data) {
    let body = {
        apikey: envs.OTP_SMS_API_KEY,
        number: data.numbers,
        message: data.message,
        senderId: envs.SMS_API_SENDER_ID,
        "templateId": "1707161130464243591"
    }

    console.log(body)

    return axios.post(envs.SMS_API_END_POINT, body).then(res => console.log(res)).catch(e => console.log("err ", e))
}


function sendTransSms(data) {
    let body = {
        number: data.numbers,
        message: data.message,
        senderId: envs.SMS_API_SENDER_ID,
        templateId: data.templateId,
        apikey: envs.TRANS_SMS_API_KEY

    }
    return axios.post(envs.SMS_API_END_POINT, body)
}

function generateOTP() {
    return Math.floor(10000 + Math.random() * 90000)
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function genRandDecimal(min, max, decimalPlaces) {
    var rand = Math.random() < 0.5 ? ((1 - Math.random()) * (max - min) + min) : (Math.random() * (max - min) + min);  // could be min or max or anything in between
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
}

function getRandomFromArray(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        return [arr[0], arr[1], arr[2]]
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
function distanceLatLng(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist.toFixed(3);
    }
}
function generateReferralCode() {
    const str_result = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let parts = str_result.split('');
    for (let i = parts.length; i > 0;) {
        let random = parseInt(Math.random() * i);
        let temp = parts[--i];
        parts[i] = parts[random];
        parts[random] = temp;
    }
    return parts.join('').substring(0, 9);
}

function generateHeartId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }

commons.sendOTPSms = sendOTPSms
commons.generateOTP = generateOTP
commons.sendTransSms = sendTransSms
commons.randomIntFromInterval = randomIntFromInterval
commons.getRandomFromArray = getRandomFromArray
commons.genRandDecimal = genRandDecimal
commons.checkConsole = checkConsole
commons.distanceLatLng = distanceLatLng
commons.generateReferralCode = generateReferralCode
commons.generateHeartId = generateHeartId

module.exports = commons