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
                year,
                month
            order by
                count desc,
                year desc,
                month desc
        `;

        const [productInterestData, _] = await db.execute(
            get_product_interest_query,
            [productId]
        );

        return productInterestData;
    }

    static async getMaxSaleProducts(start_date, end_date, number_of_rows) {
        const max_sale_query = `call max_sales( ? , ? , ? ) ;`;
        const [max_sales, _] = await db.execute(max_sale_query, [
            start_date,
            end_date,
            number_of_rows,
        ]);
        return max_sales;
    }

    static async getQuaterlySalesReport(year) {
        // sample sql
        const sql = `
        select concat(p.product_title, ' ',v.variant_name) as item_name, sum(v.price) as sell_total,
        case 
        when month(s.date_time) between 1 and 3 then 1 
        when month(s.date_time) between 4 and 6 then 2 
        when month(s.date_time) between 7 and 9 then 3 
        when month(s.date_time) between 10 and 12 then 4
        else 5
        end as quater
        from sell s
        join \`order\` o on s.order_id=o.order_id
        join cart_product cp on o.cart_id=cp.cart_id
        join variant v on cp.variant_id=v.variant_id
        join product p on v.product_id=p.product_id
        where year(s.date_time) = ?
        group by  quater, p.product_id, v.variant_id; `;

        const [report, _] = await db.execute(sql, [year]);
        return report;
    }

    static async getMostOrderCategories() {
        const sql = `select category_name,count(*) count from 
        sell s
        join \`order\` o on s.order_id=o.order_id
        join cart_product cp on o.cart_id=cp.cart_id
        join variant v on cp.variant_id=v.variant_id
        join product_category pc on v.product_id=pc.product_id
        join category c on pc.category_id=c.category_id
        where s.payment_state='PAID'
        group by category_name
        order by count desc`;
        const [orderCategoriesData, _] = await db.execute(sql);
        return orderCategoriesData;
    }
}

module.exports.Report = Report;
