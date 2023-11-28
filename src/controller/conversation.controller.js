const Conversations = require("../models/conversation.model");
const Messages = require("../models/message.model");

const getConversations = async (req, res) => {
    try {
        // get all conversation where user is in active and have at least one message + populating other user info + last message

        const conversations = await Conversations.aggregate([
            {
                $match: {
                    active: req.user._id
                }
            },
            {
                $lookup: {
                    from: 'matches',
                    localField: 'match',
                    foreignField: '_id',
                    as: 'match'
                }
            },
            {
                $unwind: '$match'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'match.users',
                    foreignField: '_id',
                    as: 'match.users'
                }
            },
            {
                $unwind: '$match.users'
            },
            {
                $match: {
                    'match.users._id': { $ne: req.user._id }
                }
            },
            {
                $lookup: {
                    from: 'messages',
                    let: { conversationId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$conversationId', '$$conversationId'] }
                            }
                        },
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $limit: 1
                        }
                    ],
                    as: 'lastMessage'
                }
            },
            {
                $unwind: {
                    path: '$lastMessage',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    match: {
                        _id: 1,
                        users: {
                            _id: 1,
                            name: 1,
                            image: 1,
                            fcmToken: 1,
                            heartId: 1
                        }
                    },
                    lastMessage: 1
                }
            },
            {
                $sort: {
                    'lastMessage.updatedAt': -1
                }
            }
        ]);

        let conversationList = []

        for (let conversation of conversations) {
            if (conversation.lastMessage) {
                conversationList.push({
                    _id: conversation._id,
                    receiver: conversation.match.users,
                    lastMessage: conversation.lastMessage
                })
            }
        }

        res.status(200).send({ success: true, message: 'Retrieved successfully!', data: conversationList });
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}

const updateConversation = async (req, res) => {
    try {
        if (req.body._id) {
            let conversation = await Conversations.findOneAndUpdate({ _id: req.body._id }, { $pull: { active: req.user._id } }, { new: true }).lean();
            if (conversation) {
                res.status(200).send({ success: true, message: 'Removed successfully!' });
            }
            else {
                res.status(404).send({ success: false, message: 'Conversation Not Found' })
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


const getMessages = async (req, res) => {
    try {
        if (req.body._id) {

            let messages = await Messages.find({ conversationId: req.body._id, active: { $all: [req.user._id] } }).lean().select('_id sender receiver message createdAt')

            res.status(200).send({ success: true, message: 'Retrieved successfully!', data: messages });
        }
        else
            res.status(400).send({ success: false, message: 'Missing Params' })

    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}

const insertMessage = async ({ sender, receiver, message, conversationId }) => await Messages.create({
    sender, receiver, message, conversationId, active: [sender, receiver]
})

const addMessage = async (req, res) => {
    try {
        let { conversationId, sender, receiver, text } = req.body;

        if (conversationId && sender && receiver && text) {
            let message = await insertMessage({ sender, receiver, message: text, conversationId })
            res.status(201).send({ success: true, message: 'Sent successfully!', data: message });

        }
        else {
            res.status(400).send({ success: false, message: 'Missing Params' })
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}

const clearMessages = async (req, res) => {
    try {
        let { conversationId } = req.body;

        if (conversationId && req.user._id) {
            await Messages.updateMany({ conversationId: conversationId }, { $pull: { active: req.user._id } }, { new: true });
            res.status(200).send({ success: true, message: 'Removed successfully!', });
        }
        else {
            res.status(400).send({ success: false, message: 'Missing Params' })
        }

    } catch (error) {
        console.log("clearMessages -> ", new Date().toString())
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}

module.exports = { getConversations, updateConversation, getMessages, addMessage, clearMessages, insertMessage }