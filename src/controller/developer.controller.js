const { sendEmail } = require("../../helpers/sendEmail")
const Contacts = require("../models/contact.model")
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

        let data = await Plans.find({ amount: { $ne: 10 } });
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

const contact = async (req, res) => {
    try {
        let { name, email, message, mobile } = req.body
        let data = {
            email: 'ankit628792@gmail.com',
            subject: `${name} has contacted you on love alarm 2.0`,
            text: `${message}`,
            html: `
            <div style="
            padding: 20px 30px;
        "><h1 style="
            font-size: 24px;
            font-weight: 500;
            color: #f15d4d;
        ">${name} has contacted you on love alarm 2.0</h1><p style="
            font-size: 18px;
            color: darkcyan;
        ">His message is: </p><p style="
            color: gray;
            font-size: 16px;
        ">${message}</p>
        
        <p style="
            font-size: 16px;
            font-weight: 400;
            margin-top: 4px;
        ">Regards<br>${name}<br>email: ${email} <br> mobile number: ${mobile || 'None'}</p>
        </div>
            `
        }

        sendEmail(data);

        if (email) {

            let data2 = {
                email: email,
                subject: `Thanks for contacting Love Alarm 2.0`,
                text: `${message}`,
                html: `
            <div style="
            padding: 20px 30px;
        "><h1 style="
            font-size: 24px;
            font-weight: 500;
            color: #f15d4d;
        ">Thanks ${name} for contacting Love Alarm 2.0</h1>
        <p style="
            color: gray;
            font-size: 16px;
        ">Our team has received your message, we'll respond you back as soon as possible. In the meantime, please let us know if you have any additional questions or concerns. Thank you for your understanding.</p></div>

        <p style="
            color: gray;
            margin-top: 4px;
            font-size: 16px;
        ">Thanks & Regards,<br/>Team Love 2.0</p></div>
            `
            }
            sendEmail(data2);
        }

        let contact = await Contacts.create(req.body)

        if (contact) {
            res.status(200).send({
                success: true,
                message: `Mail sent successfully!`,
            })
        }
        else {
            res.status(200).send({
                success: false,
                message: `Unable to send mail!`,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: error?.message })
    }
}


module.exports = { getNotices, getAllPlans, addNotice, contact }