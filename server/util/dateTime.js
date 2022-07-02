class DateTime {
    static getDBreadyCurrentDateTime() {
        const orderDate = new Date()
            .toLocaleString("en-GB", { hour12: false })
            .split(",");
        const date = orderDate[0].split("/");

        return date[2] + "-" + date[1] + "-" + date[0] + orderDate[1];
    }
}

module.exports.DateTime = DateTime;