class DateTime {
    static getDBreadyCurrentDateTime() {
        const orderDate = new Date()
            .toLocaleString("en-GB", { hour12: false })
            .split(",");
        const date = orderDate[0].split("/");

        return date[2] + "-" + date[1] + "-" + date[0] + orderDate[1];
    }

    static convertToLocalDateTime(date) {
        if (date) {
            const utcDate = new Date(date);
            return utcDate.toString().split("GMT")[0];
        }
        return null;
    }
}

module.exports.DateTime = DateTime;
