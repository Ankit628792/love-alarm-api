const envs = require("../../config/env");
const { encrypt, decrypt, createAccessToken, sendTwilioOTP } = require("../../helpers");
const { generateOTP, sendOTPSms, generateHeartId, generateReferralCode } = require("../../helpers/functions");
const Orders = require("../models/order.model");
const OTPs = require("../models/otp.model");
const Plans = require("../models/plan.model");
const Users = require("../models/user.model");
const countryToCurrency = require('country-to-currency');

const sendOtp = async (req, res) => {
    try {
        if (req.body.mobile) {
            let otp = generateOTP();
            var message = `Dear User, Your OTP to verify number on Love Alarm 2.0 is <#> ${otp} ${req.body.hash || ''} valid for next 5 minutes. Do not share this OTP with anyone`
            // await sendOTPSms({ message: message, numbers: [req.body.mobile] })
            sendTwilioOTP({ mobile: req.body.mobile, message })
            console.log(otp)
            let doc = await OTPs.create({
                mobile: req.body.mobile,
                otp: encrypt(otp?.toString(), otp?.toString())
            })
            setTimeout(() => OTPs.findByIdAndUpdate({ _id: doc._id }, { isExpired: true }), 1000 * 60 * 5);
            res.status(201).send({
                success: true,
                message: 'OTP sent successfully!'
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
        if (mobile && otp) {
            let isOtp = await OTPs.findOne({ mobile, otp }).sort({ createdAt: -1 });
            if (isOtp || envs.MAGIC_OTP == otp) {
                if (isOtp?.isExpired && envs.MAGIC_OTP !== otp) {
                    res.status(200).send({
                        success: false,
                        message: 'OTP Expired!'
                    })
                }
                else {
                    let plan = await Plans.findOne({ planType: 'subscription', amount: 10 })
                    let isUser = await Users.findOne({ mobile }).lean()
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
                        user = await Users.create({
                            plan: plan._id,
                            mobile,
                            heartId: generateHeartId(7),
                            fcmToken,
                            referralCode: generateReferralCode(),
                            currency
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

                    await OTPs.deleteMany({ mobile: mobile });
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