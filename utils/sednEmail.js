const nodemailer = require('nodemailer')



const sendEmail = ({
    to = process.env.FROM_EMAIL,
    message = "test Email",
    subject = "test subject" }) => new Promise((resolve, reject) => {


        try {
            const mailer = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.FROM_EMAIL,
                    pass: process.env.EMAIL_PASS
                },
            })

            mailer.sendMail({ to, subject, text: message, from: process.env.FROM_EMAIL }, (err) => {
                if (err) {
                    console.log(err);
                    return reject(err)
                } else {
                    console.log("email send Successfully ");
                    return resolve("Email send success")
                }

            })
        } catch (error) {
            console.log(error);
            return reject(error.message)
        }
    })


module.exports = sendEmail