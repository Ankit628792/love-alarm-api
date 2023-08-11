const envs = require("../../config/env");
const { encrypt, createAccessToken, sendMessageBird } = require("../../helpers");
const { generateOTP, generateHeartId, generateReferralCode } = require("../../helpers/functions");
const Orders = require("../models/order.model");
const OTPs = require("../models/otp.model");
const Plans = require("../models/plan.model");
const Users = require("../models/user.model");
const countryToCurrency = require('country-to-currency');
const countryCodes = require('../../CountryCodes.json')

const sendOtp = async (req, res) => {
    try {
        if (req.body.mobile) {
            let otp = generateOTP();
            var message = `Dear User, Your OTP to verify number on Love Alarm 2.0 is <#> ${otp} valid for next 5 minutes. Do not share this OTP with anyone - Regards Love 2.0`

            // try {
            //     sendMessageBird({ mobile: req.body.mobile, message })
            // } catch (error) {
            //     console.log("SMS ERROR");
            //     console.log(error)
            // }
            console.log(otp)
            let doc = await OTPs.create({
                mobile: req.body.mobile.replace(/\s+/g, ''),
                otp: encrypt(otp?.toString(), otp?.toString())
            })
            setTimeout(() => OTPs.findByIdAndUpdate({ _id: doc._id }, { isExpired: true }), 1000 * 60 * 5);
            res.status(201).send({
                success: true,
                message: 'OTP sent successfully!',
                otp: otp
            })
        }
        else {
            res.status(400).send({
                success: false,
                message: 'Missing Params'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: error?.message
        })
    }
}

const verifyOtp = async (req, res) => {
    try {
        let { mobile, otp, fcmToken, countryCode } = req.body
        let country = countryCodes.find(item => item.iso == countryCode).country
        if (mobile && otp) {
            let isOtp = await OTPs.findOne({ mobile: mobile.replace(/\s+/g, ''), otp }).sort({ createdAt: -1 });
            if (isOtp || envs.MAGIC_OTP == otp) {
                if (isOtp?.isExpired && envs.MAGIC_OTP !== otp) {
                    res.status(200).send({
                        success: false,
                        message: 'OTP Expired!'
                    })
                }
                else {
                    let plan = await Plans.findOne({ planType: 'subscription', amount: 10 })
                    let isUser = await Users.findOne({ mobile: mobile.replace(/\s+/g, '') }).lean()
                    let user;

                    if (isUser) {
                        user = await Users.findByIdAndUpdate({ _id: isUser._id }, { 'setting.isActive': true, fcmToken: fcmToken }, { new: true }).lean()
                    }
                    else {
                        let currency;
                        try {
                            currency = countryToCurrency[countryCode] || 'USD';
                        } catch (error) {
                            currency = 'USD';
                        }
                        let country = countryCodes.find(item => item.iso == countryCode).country
                        user = await Users.create({
                            plan: plan._id,
                            mobile: mobile.replace(/\s+/g, ''),
                            heartId: generateHeartId(7),
                            fcmToken,
                            referralCode: generateReferralCode(),
                            currency,
                            country
                        })

                        let validity = new Date();
                        validity.setDate(validity.getDate() + plan.noOfDays);
                        await Orders.create({
                            user: user?._id,
                            status: 'completed',
                            paymentFor: 'subscription',
                            plan: plan._id,
                            paymentAmount: plan.amount,
                            paymentCurrency: plan.currency,
                            validUpto: validity,
                            paymentMethod: 'new sign up',
                            metadata: {
                                customer_mobile: user.mobile,
                            }
                        });
                    }

                    await OTPs.deleteMany({ mobile: mobile.replace(/\s+/g, '') });
                    let token = await createAccessToken({ _id: user._id, heartId: user?.heartId });
                    res.status(200).send({
                        success: true,
                        message: 'OTP Verified!',
                        token,
                        status: user.status
                    })
                }
            }
            else {
                res.status(200).send({
                    success: false,
                    message: 'Invalid OTP'
                })
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: 'Missing Params'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: error?.message
        })
    }
}

const validateUser = async (req, res) => {
    try {
        res.status(200).send({
            success: true,
            message: 'User retrieved successfully!',
            data: req.user
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: error?.message
        })
    }
}

const logout = async (req, res) => {
    try {
        if (req.body._id) {
            await Users.findByIdAndUpdate({ _id: req.body._id }, { 'setting.isActive': false, fcmToken: '' })
            res.status(200).send({
                success: true,
                message: 'Logged Out successfully!',
            })
        }
        else {
            res.status(401).send({
                success: false,
                message: "UnAuthorized"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: error?.message
        })
    }
}


module.exports = { sendOtp, verifyOtp, validateUser, logout }