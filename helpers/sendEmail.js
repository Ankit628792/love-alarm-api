const nodemailer = require('nodemailer');
const envs = require('../config/env');

const sendEmail = async (data) => {
    try {

        var transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            ssl: false,
            secure: true,

            auth: {
                user: envs.MAIL_ID,
                pass: envs.MAIL_PASSWORD,
            },
        });

        transporter.verify(function (error, success) {
            if (error) {
                console.log("VERIFICATION ERROR")
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });

        const mailData = {
            from: envs.MAIL_ID,
            to: `${data.email}`,
            subject: `${data.subject}`,
            text: `${data.text}`,
            html: `${data.html}`
        }

        const info = await transporter.sendMail(mailData);
        console.log("result : ", info);
        return 'mail sent'

    }
    catch (error) {
        console.log(error)
    }
}

module.exports = { sendEmail }