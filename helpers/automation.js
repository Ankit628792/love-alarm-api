var scheduler = require('node-schedule')
const Plans = require('../src/models/plan.model');
const Users = require('../src/models/user.model');
const Orders = require('../src/models/order.model');

const planAutomation = () => scheduler.scheduleJob('10 0 0 * * *', async function () {
    let freePlan = await Plans.findOne({ planType: 'free', name: 'Free Plan' })
    const users = await Users.find({ plan: { $ne: freePlan?._id } });
    await Promise.all(users.map(async (user) => {
        const expired = await Orders.findOne({
            user: user._id,
            status: 'complete',
        }).sort({ createdAt: -1 })

        if (expired && new Date() > new Date(expired?.validUpto)) {
            await Users.findByIdAndUpdate({ _id: user._id }, { plan: freePlan._id })
        }
    }))
});

module.exports = { likesAutomation, planAutomation }

