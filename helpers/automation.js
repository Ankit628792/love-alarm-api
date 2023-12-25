var scheduler = require('node-schedule')
const Plans = require('../src/models/plan.model');
const Users = require('../src/models/user.model');
const Orders = require('../src/models/order.model');
const OTPs = require('../src/models/otp.model');
const Conversations = require('../src/models/conversation.model');
const Matches = require('../src/models/match.model');
const Messages = require('../src/models/message.model');

const planAutomationOld = () => scheduler.scheduleJob('10 0 0 * * *', async function () {
    let freePlan = await Plans.findOne({ planType: 'free' }).lean()
    const users = await Users.find({ plan: { $ne: freePlan?._id } }).lean();
    await Promise.all(users.map(async (user) => {
        const expired = await Orders.findOne({
            user: user._id,
            status: 'completed',
        }).sort({ createdAt: -1 }).lean()

        if (expired && new Date() > new Date(expired?.validUpto)) {
            await Users.findByIdAndUpdate({ _id: user._id }, { plan: freePlan._id })
        }
    }))
});

const planAutomation = () => scheduler.scheduleJob('10 0 0 * * *', async function () {
    let freePlan = await Plans.findOne({ planType: 'free' }).lean();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);

    const today = new Date();

    const orders = await Orders.find({
        status: 'completed',
        validUpto: {
            $gte: twoDaysAgo,
            $lt: today
        }
    }).select('validUpto user').sort({ createdAt: -1 }).lean();

    try {
        await Promise.all(orders.map(async (order) => {
            await Users.findOneAndUpdate({ _id: order.user, plan: { $ne: freePlan._id } }, { plan: freePlan._id });
        }))
    } catch (error) {
        console.log("planAutomation -> ", new Date().toString());
        console.log(error)
    }

});

const otpAutomation = () => scheduler.scheduleJob('5 0 0 * * *', async function () {
    let date = new Date()
    date.setDate(date.getDate() - 1)
    await OTPs.deleteMany({ createdAt: { $lte: date.toISOString() } })
});


const orderAutomation = () => scheduler.scheduleJob('20 0 0 * * *', async function () {
    let date = new Date()
    date.setDate(date.getDate() - 7)
    await Orders.deleteMany({ status: 'pending', createdAt: { $lte: date.toISOString() } })
});

const locationAutomation = () => scheduler.scheduleJob('0 * * * *', async function () {
    let location = {
        type: 'Point',
        coordinates: [0, 0]
    }
    let date = new Date();
    date.setHours(date.getHours() - 1);
    try {
        await Users.updateMany({ updatedAt: { $lte: date.toISOString() }, 'location.coordinates': { $ne: [0, 0] } }, { location });
    } catch (error) {
        console.log("locationAutomation -> ", new Date().toString());
        console.log(error)
    }
});

const removeMatchChat = () => scheduler.scheduleJob('40 0 0 * * *', async function () {
    let date = new Date()
    date.setDate(date.getDate() - 1)
    let conversations = await Conversations.find({ active: [], createdAt: { $lte: date.toISOString() } }).select('_id').lean();
    const ids = conversations.map(el => el._id);
    await Messages.deleteMany({ conversationId: { $in: ids } });
    await Conversations.deleteMany({ active: [], createdAt: { $lte: date.toISOString() } })
    await Matches.deleteMany({ users: [], createdAt: { $lte: date.toISOString() } })
});


const automation = () => {
    locationAutomation();
    otpAutomation();
    planAutomation();
    orderAutomation();
    removeMatchChat();
}


module.exports = automation

