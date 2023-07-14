const envs = require("../../config/env");
const { cloudinary, stripe } = require("../../helpers");
const { verifyImage, sendVerifyResponse } = require("../../helpers/sightengine");
const Feedbacks = require("../models/feedback.model");
const Orders = require("../models/order.model");
const Plans = require("../models/plan.model");
const Rings = require("../models/ring.model");
const Users = require("../models/user.model");
const fs = require('fs');
const moment = require('moment');

const ImageURLRegex = /\/v\d+\/([^/]+)\.\w{3,6}$/;
const getPublicIdFromUrl = (url) => {
    const match = url.match(ImageURLRegex);
    return match ? match[1] : null;
};

const updateLocation = async (req, res) => {
    try {
        // console.log(req.body)
        if (req.body.location && req.body?._id) {
            let location = {
                type: 'Point',
                coordinates: [req.body.location?.latitude, req.body.location?.longitude]
            }

            let user = await Users.findByIdAndUpdate({ _id: req.body?._id }, { location }, { new: true });

            // Find users within a 20-meter radius of the reference location
            let users = await Users.find({
                location: {
                    $geoWithin: {
                        // [[latitude, longitude], radius in meter / Earth's radius]
                        $centerSphere: [location.coordinates, 2000 / 6378.1] // Divide the radius (20 meters) by the Earth's radius (6378.1 km) for correct conversion
                    }
                },
                _id: { $nin: [user.blockedBy, user._id] },
                gender: user?.interestedIn,
                onboardStep: { $gte: 1 },
                status: 'active',
                age: { $gte: user.age - 5, $lte: user.age + 5 },
                'setting.isActive': true
            },
                '_id name image heartId fcmToken location'
            ).lean()

            let data = await Promise.all(users.map(async (item) => {
                let receiverArr = await Rings.findOne({ sender: item?._id, receiver: user?._id, receiverVisibility: true }, '_id').lean(); // logged in user is receiver
                let senderArr = await Rings.findOne({ receiver: item?._id, sender: user?._id, senderVisibility: true }, '_id').lean(); // logged in user is sender
                return {
                    ...item,
                    isSender: receiverArr?._id ? true : false, // this user is sender and logged in is receiver 
                    isReceiver: senderArr?._id ? true : false, // this user is receiver and logged in is sender
                }
            }))

            res.status(200).send({
                success: true,
                message: 'Retrieved Successfully!',
                data
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

const updateProfile = async (req, res) => {
    try {
        if (req.user?._id) {
            let body = req.body;
            if (body.dateOfBirth) {
                let age = moment().diff(moment(body.dateOfBirth), 'years');
                body.age = age
            }
            const user = await Users.findByIdAndUpdate({ _id: req?.user?._id }, req.body, { new: true });
            res.status(200).send({
                success: true,
                message: 'Profile Updated Successfully!'
            })
        }
        else {
            res.status(400).send({
                success: false,
                message: error?.message
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

const getProfile = async () => {
    try {
        if (req.user?._id) {
            const user = await Users.findById({ _id: req?.user?._id }).select('_id name email mobile gender image interestedIn age heartId referralCode').lean().populate('plan', 'name planType');
            res.status(200).send({
                success: true,
                message: 'Retrieved Successfully!',
                data: user
            })
        }
        else {
            res.status(400).send({
                success: false,
                message: error?.message
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

const updateImage = async (req, res) => {

    let user = req.user;

    try {
        if (!user) throw Error("User Not found")
        if (req.file) {
            let path = req.file?.path?.split("public")[1].split("\\").join("/")
            console.log(path)
            let url = `${envs.PRODUCTION_URL}${path}`
            console.log(url)
            // let url = `${envs.PROTOCOL}://${envs.HOST}/${req.file?.path}`
            let imageVerify;
            try {
                imageVerify = await verifyImage({ image: url });
                imageVerify = sendVerifyResponse(imageVerify);
            } catch (error) {
                console.log(error.message);
                imageVerify = {
                    verified: false
                };
            }

            console.log(imageVerify, 2)
            // Add AES.encrypt before sending image response
            if (imageVerify.verified && imageVerify.faceDetected == 1 && imageVerify.nuditySafeProbability > 0.7) {

                // Upload the file to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path);
                let imageUrl = result.secure_url;
                // Remove the file from the local server
                fs.unlinkSync(req.file.path);
                await Users.findByIdAndUpdate({ _id: user._id }, { image: imageUrl }, { new: true }).lean();
                if (user.image) {
                    const publicId = getPublicIdFromUrl(user.image);
                    try {
                        // Remove the old file from the remote server
                        cloudinary.uploader.destroy(publicId).then(res => console.log("file removed from remote: ", res)).catch(e => console.log("unable to remove remote file: ", e?.message));
                    } catch (error) {
                        console.log("Unable to delete image ", publicId)
                    }
                }

                res.status(200).send({ success: true, data: imageUrl, message: imageVerify?.reason })
            }
            else {
                // Remove the file from the local server
                fs.unlinkSync(req.file.path);
                res.status(200).send({ success: false, data: url, message: imageVerify?.reason })
            }
        } else {
            res.status(404).send({ success: false, message: 'File Not Received' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }

}

const updateSetting = async (req, res) => {
    try {
        let { setting } = req.body;
        if (setting) {
            if (typeof (setting.isActive) == 'boolean') {
                await Users.findByIdAndUpdate({ _id: req.user?._id }, { 'setting.isActive': setting.isActive }, { new: true })
            }
            else if (typeof (setting.language) == 'string') {
                await Users.findByIdAndUpdate({ _id: req.user?._id }, { 'setting.language': setting.language }, { new: true })
            }
            res.status(200).send({
                success: true,
                message: 'Updated Successfully!',
                data: setting
            })
        }
        else {
            res.status(400).send({ success: false, message: 'Missing Params' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}


const paymentIntent = async (req, res) => {

    try {
        let { _id } = req.body.plan;
        let user = req.user;
        let plan = await Plans.findOne({ _id }).lean();


        let data = {
            amount: plan.amount * 100,
            currency: 'usd',
            shipping: {
                name: 'Ankit',
                address: {
                    line1: 'Nowhere',
                    postal_code: '110078',
                    city: 'Austin',
                    state: 'Austin',
                    country: 'US',
                },
            },
            description: `Love Alarm - ${plan.name}`,
            payment_method_types: [
                'card',
                // 'google_pay',
                // 'us_bank_account',
                // 'affirm',
                // 'afterpay_clearpay',
                // 'klarna'
            ],
            metadata: {
                customer_name: user.name, // Customer's name
                customer_mobile: user.mobile, // Customer's mobile
            },
        }
        const paymentIntent = await stripe.paymentIntents.create(data);

        let order = await Orders.create({
            user: user?._id,
            status: 'pending',
            paymentFor: 'subscription',
            plan: plan._id,
            paymentAmount: plan.amount,
            paymentCurrency: plan.currency,
            paymentIntentId: paymentIntent.id
        });



        res.status(201).send({
            paymentIntent: paymentIntent.client_secret,
            customer: user.id
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })

    }
}


const userFeedback = async (req, res) => {
    try {
        let { comment, category } = req.body;
        if (comment && req.user?._id) {

            let feedback = await Feedbacks.create({ sender: req?.user?._id, comment, category })

            res.status(201).send({
                success: true,
                message: `${req.body.category} send successfully!`,
                data: feedback
            })
        }
        else {
            res.status(400).send({ success: false, message: 'Missing Params' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}

const getPlan = async (req, res) => {
    try {
        let data;
        if (req.user.plan.planType == 'free') {
            let plan = await Plans.findById({ _id: req.user.plan._id }).lean()
            data = {
                user: req.user?._id,
                plan: plan
            }
        }
        else {
            data = await Orders.findOne({ status: 'completed', user: req.user?._id }, '_id user status paymentFor plan paymentSuccessId receipt validUpto').sort({ updatedAt: -1 }).lean().populate('plan');
        }
        res.status(200).send({
            success: true,
            message: `retrieved successfully!`,
            data
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}

const referral = async (req, res) => {
    try {
        if (req.body.referral) {

            let user = await Users.findOne({ referralCode: req.body.referral, _id: { $ne: req.user._id } }).lean();
            if (user) {
                if (user.referred.includes(req.user?._id)) {
                    res.status(400).send({ success: false, message: 'Referral Code Already Used' })
                }
                else {
                    await Users.findByIdAndUpdate({ _id: user._id }, { $push: { referred: req.user._id } });
                    try {

                        let plan = await Plans.findOne({ planType: 'referral' }).lean();

                        let isOrder = await Orders.findOne({ plan: plan._id, user: req.user._id, status: 'completed', validUpto: { $gt: new Date().toISOString() } }).sort({ updatedAt: -1 }).lean();

                        let order;

                        if (isOrder) {
                            let validity = new Date(isOrder.validUpto);
                            validity.setDate(validity.getDate() + plan.noOfDays);

                            order = await Orders.findByIdAndUpdate({ _id: isOrder._id }, { validUpto: validity }, { new: true }).lean()
                        }
                        else {
                            let validity = new Date();
                            validity.setDate(validity.getDate() + order.plan.noOfDays);
                            order = await Orders.create({
                                user: user?._id,
                                status: 'completed',
                                paymentFor: 'referral',
                                plan: plan._id,
                                paymentAmount: plan.amount,
                                paymentCurrency: plan.currency,
                                validUpto: validity,
                                paymentMethod: 'referral',
                                metadata: {
                                    customer_name: req.user.name,
                                    customer_mobile: req.user.mobile,
                                }
                            });
                        }


                        if (order) {
                            await Users.findByIdAndUpdate({ _id: req.user._id }, { plan: order.plan })
                            res.status(201).send({ success: true, message: 'Referral Code Applied Successfully!!' })
                        }
                        else {
                            await Users.findByIdAndUpdate({ _id: user._id }, { $pull: { referred: req.user._id } });
                            res.status(400).send({ success: false, message: 'Unable to Apply Referral Code' })
                        }
                    } catch (error) {
                        await Users.findByIdAndUpdate({ _id: user._id }, { $pull: { referred: req.user._id } });
                        res.status(400).send({ success: false, message: 'Unable to Apply Referral Code' })
                    }
                }
            }
            else {
                res.status(400).send({ success: false, message: 'Invalid Referral Code' })
            }
        }
        else {
            res.status(400).send({ success: false, message: 'Missing Params' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}

module.exports = { updateLocation, updateProfile, getProfile, updateImage, updateSetting, paymentIntent, userFeedback, getPlan, referral }


