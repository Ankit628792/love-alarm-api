var scheduler = require('node-schedule')
const Plans = require('../src/models/plan.model');
const Users = require('../src/models/user.model');
const Orders = require('../src/models/order.model');
const OTPs = require('../src/models/otp.model');

const planAutomation = () => scheduler.scheduleJob('10 0 0 * * *', async function () {
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

    await Users.updateMany({ updatedAt: { $lte: date.toISOString() } }, { location });
});


const automation = () => {
    locationAutomation();
    otpAutomation();
    planAutomation();
    orderAutomation();
}


module.exports = automation

