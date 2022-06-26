const _ = require("lodash");
const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Report {
    static async getProductInterest(productId) {
        const get_product_interest_query = `
            select
                year(o.date) year,
                month(o.date) month,
                count(*) count
            from
                \`order\` o
                join
                    cart_product cp
                    on o.cart_id = cp.cart_id
                join
                    variant v
                    on cp.variant_id = v.variant_id
                join
                    product p
                    on v.product_id = p.product_id
            where
                p.product_id = ?
            group by
                year(o.date),
                month(o.date)
            order by
                count desc
        `;

        const [productInterestData, _] = await db.execute(
            get_product_interest_query,
            [productId]
        );

        return productInterestData;
    }

    static async getMaxSaleProducts(start_date,end_date){
        
    }
}

module.exports.Report = Report;
