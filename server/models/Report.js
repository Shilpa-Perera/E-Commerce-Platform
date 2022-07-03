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

		const prevSql = `select v.variant_name, sum(v.price) as sell_total
        from sell s
        join \`order\` o on s.order_id=o.order_id
        join cart_product cp on o.cart_id=cp.cart_id
        right join variant v on cp.variant_id=v.variant_id
        where s.date_time between ? and ?
        group by v.variant_id;
        `;

		const [report, _] = await db.execute(sql, [year]);

		// const [quater1, _1] = await db.execute(sql, [
		//     quaterDates[1].startDate(year),
		//     quaterDates[1].endDate(year),
		// ]);
		// const [quater2, _2] = await db.execute(sql, [
		//     quaterDates[2].startDate(year),
		//     quaterDates[2].endDate(year),
		// ]);
		// const [quater3, _3] = await db.execute(sql, [
		//     quaterDates[3].startDate(year),
		//     quaterDates[3].endDate(year),
		// ]);
		// const [quater4, _4] = await db.execute(sql, [
		//     quaterDates[4].startDate(year),
		//     quaterDates[4].endDate(year),
		// ]);

		// return [quater1, quater2, quater3, quater4];
		return report;
	}
}

module.exports.Report = Report;
