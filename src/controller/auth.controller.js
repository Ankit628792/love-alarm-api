const envs = require("../../config/env");
const { encrypt, decrypt, createAccessToken } = require("../../helpers");
const { generateOTP, sendOTPSms, generateHeartId, generateReferralCode } = require("../../helpers/functions");
const OTPs = require("../models/otp.model");
const Plans = require("../models/plan.model");
const Users = require("../models/user.model");


const sendOtp = async (req, res) => {
    try {
        if (req.body.mobile) {
            let otp = generateOTP();
            var message = `Your OTP to verify number on Love Alarm is <#> ${otp} ${req.body.hash} valid for next 5 minutes. Do not share this OTP with anyone`
            // await sendOTPSms({ message: message, numbers: [req.body.mobile] })
            console.log(otp)
            let doc = await OTPs.create({
                mobile: req.body.mobile,
                otp: encrypt(otp?.toString(), otp?.toString()),
                realOTP: otp  // will be removed in production
            })
            setTimeout(() => OTPs.findByIdAndUpdate({ _id: doc._id }, { isExpired: true }), 1000 * 60 * 5);
            res.status(200).send({
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
        let { mobile, otp, fcmToken } = req.body
        if (mobile && otp) {

            let isOtp = await OTPs.findOne({ mobile, otp }).sort({ createdAt: -1 });
            if (isOtp || (envs.MAGIC_OTP == decrypt(otp, otp))) { // remove magic otp in production

                if (isOtp.isExpired) {
                    res.status(200).send({
                        success: false,
                        message: 'OTP Expired!'
                    })
                }
                else {
                    let plan = await Plans.findOne({ planType: 'free' })
                    let isUser = await Users.findOne({ mobile }).lean()
                    let user;
                    if (isUser) {
                        user = isUser
                    }
                    else {
                        user = await Users.create({
                            plan: plan._id,
                            mobile,
                            heartId: generateHeartId(7),
                            fcmToken,
                            referralCode: generateReferralCode()
                        })
                    }

                    await OTPs.deleteMany({ mobile: mobile });
                    let token = await createAccessToken({ _id: user._id, heartId: user?.heartId });
                    res.status(200).send({
                        success: true,
                        message: 'OTP Verified!',
                        token,
                        onboardStep: user.status
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


module.exports = { sendOtp, verifyOtp, validateUser }