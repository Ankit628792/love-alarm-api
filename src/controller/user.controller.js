const envs = require("../../config/env");
const { cloudinary, stripe } = require("../../helpers");
const { generateHeartId, generateReferralCode } = require("../../helpers/functions");
const { verifyImage, sendVerifyResponse } = require("../../helpers/sightengine");
const Rings = require("../models/ring.model");
const Users = require("../models/user.model")
const fs = require('fs')
const moment = require('moment')

const updateLocation = async (req, res) => {
    try {
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
                onboardStep: { $gte: 5 },
                status: 'active',
                age: { $gte: user.age - 5, $lte: user.age + 5 },
                'setting.isActive': true
            },
                '_id name image heartId fcmToken location'
            ).lean()
            // .populate({
            //     path: 'Rings',
            //     match: { $or: [{ sender: user._id }, { receiver: user._id }] }
            // })

            let data = await Promise.all(users.map(async (item) => {
                let receiverArr = await Rings.findOne({ sender: item?._id, receiver: user?._id, receiverVisibility: true }, '_id').lean();
                return { ...item, isSender: receiverArr?._id ? true : false }
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
            const user = await Users.findById({ _id: req?.user?._id }).select('_id name email mobile gender image interestedIn age heartId referralCode').populate('Plans', 'name planType');
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
    console.log(req.file)
    try {
        if (!user) throw Error("User Not found")
        if (req.file) {
            let path = req.file?.path?.split("public")[1].split("\\").join("/")
            let url = `https://4267-103-165-28-188.ngrok-free.app/${path}`
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
            console.log(imageVerify)
            // Add AES.encrypt before sending image response
            if (imageVerify.verified && imageVerify.faceDetected == 1 && imageVerify.nuditySafeProbability > 0.7) {

                // Upload the file to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path);
                let imageUrl = result.secure_url;
                // Remove the file from the local server
                fs.unlinkSync(req.file.path);
                await Users.findByIdAndUpdate({ _id: user._id }, { image: imageUrl })
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

const getAlarmRings = async (req, res) => {
    try {
        // Count rings for each receiver
        let senderRings = await Rings.aggregate([
            {
                $match: { sender: req.user?._id, senderVisibility: true }
            },
            {
                $group: {
                    _id: '$receiver',
                    ringCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'receiver' // Populate the receiver's information
                }
            },
            {
                $project: {
                    _id: 0,
                    receiver: { $arrayElemAt: ['$receiver', 0] }, // Extract the receiver information from the array
                    ringCount: 1 // Include the ring count in the result
                }
            },
            {
                $project: {
                    'receiver.name': 1, // Include the receiver's name
                    'receiver.image': 1, // Include the receiver's image
                    'receiver.heartId': 1,
                    ringCount: 1 // Include the ring count
                }
            }
        ]);
        let receiverRings = await Rings.aggregate([
            {
                $match: { receiver: req.user?._id, receiverVisibility: true }
            },
            {
                $group: {
                    _id: '$sender',
                    ringCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'sender' // Populate the sender's information
                }
            },
            {
                $project: {
                    _id: 0,
                    sender: { $arrayElemAt: ['$sender', 0] }, // Extract the sender information from the array
                    ringCount: 1 // Include the ring count in the result
                }
            },
            {
                $project: {
                    'sender.name': 1, // Include the sender's name
                    'sender.image': 1, // Include the sender's image
                    'sender.heartId': 1,
                    ringCount: 1 // Include the ring count
                }
            }
        ]);

        res.status(200).send({
            success: true,
            message: 'Retrieved Successfully!',
            data: {
                senderRings,
                receiverRings
            }
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}

const ringLoveAlarm = async (req, res) => {
    try {
        if (req.body.receiver && req.body.location) {
            let location = {
                type: 'Point',
                coordinates: [req.body.location.latitude, req.body.location.longitude]
            }
            let ring = await Rings.create({
                sender: req.body.sender,
                receiver: req.body.receiver,
                location    // sender's location
            })
            res.status(200).send({
                success: true,
                message: 'Ringed Love Alarm',
            })
        }
        else
            res.status(400).send({ success: false, message: 'Missing Params' })
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}

const pauseRinging = async (req, res) => {
    try {
        if (req.body.receiver) {
            await Rings.updateMany({
                sender: req.user?._id,
                receiver: req.body.receiver,
                senderVisibility: false
            })
        }
        else if (req.body.sender) {
            await Rings.updateMany({
                sender: req.body.sender,
                receiver: req.user?._id,
                senderVisibility: false
            })
        }
        else
            res.status(400).send({ success: false, message: 'Missing Params' })
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
    let user = {
        id: 123456789,
        name: 'User test'
    }

    let plan = req.body.plan

    let data = {
        amount: plan.amount * 100,
        currency: 'usd',
        shipping: {
            name: 'My Name',
            address: {
                line1: '510 Townsend St',
                postal_code: '98140',
                city: 'San Francisco',
                state: 'CA',
                country: 'US',
            },
        },
        description: 'testing the app',
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
        },
    }

    const paymentIntent = await stripe.paymentIntents.create(data)

    res.status(200).send({
        paymentIntent: paymentIntent.client_secret,
        // ephemeralKey: ephemeralKey.secret,
        customer: user.id
    })
}


module.exports = { updateLocation, updateProfile, getProfile, updateImage, getAlarmRings, ringLoveAlarm, pauseRinging, updateSetting, paymentIntent }