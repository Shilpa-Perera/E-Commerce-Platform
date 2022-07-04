const { Variant } = require("../models/Variant");
const { CustomerAddress } = require("../models/Customer");

class Delivery {
    static async calcDeliveryEstimation(zipcode, cartId) {
        let deliveryDays = 0;
        deliveryDays =
            Delivery.calcDistanceEstimation(zipcode) +
            (await Delivery.estimationStockCalc(cartId));
        return deliveryDays;
    }

    static async calcVariantDeliveryEstimation(zipcode, stock) {
        let deliveryDays = Delivery.calcDistanceEstimation(zipcode);
        deliveryDays += stock <= 0 ? 3 : 0;
        return deliveryDays;
    }

    static calcDistanceEstimation(zipcode) {
        const mainCities = [
            "00100",
            "00200",
            "00300",
            "00400",
            "00500",
            "00600",
            "00700",
            "00800",
            "00900",
            "01000",
            "01100",
            "01200",
            "01300",
            "01400",
            "01500",
            "11000",
            "12000",
            "20000",
            "21000",
            "22200",
            "30000",
            "31000",
            "32000",
            "40000",
            "41000",
            "42000",
            "43000",
            "44000",
            "50000",
            "51000",
            "60000",
            "61300",
            "70000",
            "71055",
            "80000",
            "82000",
            "81000",
            "90000",
            "91000",
        ];
        return mainCities.includes(zipcode) ? 5 : 7;
    }

    static async estimationStockCalc(cartId) {
        const isOutOfStock = await Variant.checkCartItemVariantStock(cartId);
        return isOutOfStock ? 3 : 0;
    }

    static async getDeliveryEstimationByUserAndVariant(userId, stock) {
        const addresses = await CustomerAddress.getAddressesById(userId);

        for (const address of addresses) {
            address.estimated_delivery =
                await Delivery.calcVariantDeliveryEstimation(
                    address.postal_code,
                    stock
                );
        }

        return addresses;
    }
}

module.exports.Delivery = Delivery;
