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

const addNotice = async (req, res) => {
    let { icon, title, description } = req.body
    let data = await Notices.create({
        icon: icon || 'https://cdn-icons-png.flaticon.com/512/10281/10281551.png',
        title: title || 'iOS App 2',
        description: description || `Our Developer are working on iOS app. It'll be available on app store soon`
    })

    res.status(200).send(data)
}


module.exports = { getNotices, getAllPlans, addNotice }