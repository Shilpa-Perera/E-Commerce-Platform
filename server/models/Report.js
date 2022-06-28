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

    static async getMaxSaleProducts(start_date, end_date) {}

    static async getQuaterlySalesReport(year) {
        const quaterDates = {
            1: {
                startDate: (year) => year + "-01-01",
                endDate: (year) => year + "-03-31",
            },
            2: {
                startDate: (year) => year + "-04-01",
                endDate: (year) => year + "-06-30",
            },
            3: {
                startDate: (year) => year + "-07-01",
                endDate: (year) => year + "-09-30",
            },
            4: {
                startDate: (year) => year + "-10-01",
                endDate: (year) => year + "-12-31",
            },
        };

        // sample sql
        const sql = `
        select v.variant_name, sum(v.price) as sell_total
        from sell s
        join \`order\` o on s.order_id=o.order_id
        join cart_product cp on o.cart_id=cp.cart_id
        join variant v on cp.variant_id=v.variant_id
        where s.date_time between ? and ?
        group by v.variant_id;
        `;

        const [quater1, _1] = await db.execute(sql, [
            quaterDates[1].startDate(year),
            quaterDates[1].endDate(year),
        ]);
        const [quater2, _2] = await db.execute(sql, [
            quaterDates[2].startDate(year),
            quaterDates[2].endDate(year),
        ]);
        const [quater3, _3] = await db.execute(sql, [
            quaterDates[3].startDate(year),
            quaterDates[3].endDate(year),
        ]);
        const [quater4, _4] = await db.execute(sql, [
            quaterDates[4].startDate(year),
            quaterDates[4].endDate(year),
        ]);

        return [quater1, quater2, quater3, quater4];
    }
}

module.exports.Report = Report;
