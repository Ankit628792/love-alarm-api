const Notices = require("../models/notice.model")
const Plans = require("../models/plan.model")

const getNotices = async (req, res) => {
    try {
        let notices = await Notices.find({ active: true }).sort({ createdAt: -1 })
        res.status(200).send({ success: true, message: 'Successfully retrieved', data: notices })
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })

    }
}


const getAllPlans = async (req, res) => {
    try {

        let data = await Plans.find();
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


module.exports = { getNotices, getAllPlans }