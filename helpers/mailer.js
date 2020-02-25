const nodemailer = require("nodemailer");

class mailer {
    constructor() {
        this.smtp = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "akite.cloud",
                pass: "f5a175acac4a00aa702424d53b01903a"
            },
            port: 465,
            secure: true
        });
    }
    async send(data) {
        let mailOptions;
        switch (data.source) {
            case "email-verification": {
                mailOptions = {
                    to: data.login,
                    from: "akite.cloud@gmail.com",
                    subject: `AskBrains | Email verification`,
                    html: `Hello.<br> Confirm your email and activate account: ${data.login}<br><br>
			        		<a href="${data.link}" target="_blank">Click here</a>`
                };
                break;
            }
            case "password-reset": {
                mailOptions = {
                    to: data.login,
                    from: "akite.cloud@gmail.com",
                    subject: `AskBrains | Reset Password`,
                    html: `Hello.<br> Success reset password for account: ${data.login}<br><br>
			        		New password: ${data.password}`
                };
                break;
            }
            case "reset-link": {
                mailOptions = {
                    to: data.login,
                    from: "akite.cloud@gmail.com",
                    subject: `AskBrains | Reset Password`,
                    html: `Hello.<br> Confirm password resetting for account: ${data.login}<br><br>
			        			<a href="${data.link}" target="_blank">Click here</a>`
                };
                break;
            }
        }

        let mailResult = await this.smtp.sendMail(mailOptions);
        return mailResult;
    }
}

const Mailer = new mailer();

module.exports = Mailer;
