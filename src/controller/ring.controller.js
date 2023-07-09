const Matches = require("../models/match.model");
const Rings = require("../models/ring.model");

// use different controller for rings
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
                    from: 'users',
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
                    'receiver._id': 1,
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
                    from: 'users',
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
                    'sender._id': 1,
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


const insertRing = async ({ sender, receiver, location }) => await Rings.create({
    sender: sender,
    receiver: receiver,
    location    // sender's location
});

const handlePostRing = async ({ sender, receiver }) => {
    let ring = await Rings.findOne({ sender: receiver, receiver: sender }).lean();
    if (ring) {
        let match = await Matches.findOne({ users: { $all: [sender, receiver] } }).lean();
        if (!match) {
            await Matches.create({ users: [sender, receiver] })
        }
    }
}


const ringLoveAlarm = async (req, res) => {
    try {
        let { sender, receiver } = req.body
        if (receiver && req.body.location) {
            let location = {
                type: 'Point',
                coordinates: [req.body.location.latitude, req.body.location.longitude]
            }
            let ring = await insertRing({ sender, receiver, location })

            handlePostRing({ sender: ring.sender, receiver: ring.receiver })

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
            }, {
                senderVisibility: false
            })
            res.status(200).send({ success: true, message: 'Successfully Removed' })
        }
        else if (req.body.sender) {
            await Rings.updateMany({
                sender: req.body.sender,
                receiver: req.user?._id,
            }, {
                receiverVisibility: false
            })
            res.status(200).send({ success: true, message: 'Successfully Removed' })
        }
        else
            res.status(400).send({ success: false, message: 'Missing Params' })
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}


const getMatches = async (req, res) => {
    try {

        let matches = await Matches.findOne({ users: { $all: [req.user._id] } }).populate({
            path: 'users',
            match: { 'setting.isActive': true },
            select: '_id name image'
        });

        res.status(200).send({
            success: true,
            message: `${req.body.category} send successfully!`,
            data: matches
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}

module.exports = { getAlarmRings, ringLoveAlarm, pauseRinging, getMatches }