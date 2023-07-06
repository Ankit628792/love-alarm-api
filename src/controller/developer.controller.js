const Notices = require("../models/notice.model")

const getNotices = async (req, res) => {
    try {
        let notices = await Notices.find({ active: true })
        res.status(200).send({ success: true, message: 'Successfully retrieved', data: notices })
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })

    }
}

module.exports = { getNotices }