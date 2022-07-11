const nodemailer = require("nodemailer");
const senderEmail = process.env.EMAIL_Username;
class EmailUtil {
    static getTransporter() {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: senderEmail,
                pass: process.env.EMAIL_Password,
            },
        });
        return transporter;
    }

    static sendEmail(
        recieverEmail,
        emailSubject,
        emailBody,
        bodyIsHtml = false
    ) {
        const mailOptions = bodyIsHtml
            ? {
                  from: senderEmail,
                  to: recieverEmail,
                  subject: emailSubject,
                  html: emailBody,
              }
            : {
                  from: senderEmail,
                  to: recieverEmail,
                  subject: emailSubject,
                  text: emailBody,
              };

        EmailUtil.getTransporter().sendMail(
            mailOptions,
            function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            }
        );
    }
}

module.exports.EmailUtil = EmailUtil;