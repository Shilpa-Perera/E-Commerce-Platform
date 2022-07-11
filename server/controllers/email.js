const { EmailUtil } = require("../util/emailModule");

class EmailController {
    static emailOrderConfirmation(orderData) {
        EmailUtil.sendEmail("test@email.com", "Subject", "Body");
    }
}

module.exports.EmailController = EmailController;
