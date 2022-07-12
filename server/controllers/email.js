const { Order } = require("../models/Order");
const { DateTime } = require("../util/dateTime");
const { EmailUtil } = require("../util/emailModule");

class EmailController {
    static async emailOrderConfirmation(orderData, orderId, customerEmail) {
        const style = `style="
        border: 1px solid black;
        border-collapse: collapse;"`;
        let orderTotal = 0;
        const cartItems = await Order.getOrderCart(orderId);
        const orderDetails = await Order.getOrderById(orderId);

        const cartRows = cartItems[0]
            .map((e) => {
                const orderCartRows = `<tr>
                <td ${style}>
                    ${e.product_title}
                </td>
                <td ${style}>
                    ${e.variant_name}
                </td>
                <td ${style}>
                    ${e.price}
                </td>
                <td ${style}>
                    ${e.number_of_items}
                </td>
                <td ${style}>
                    ${e.number_of_items * e.price}
                </td>
            </tr>`;

                orderTotal += e.number_of_items * e.price;
                return orderCartRows;
            })
            .join("");

        let cart = `<div>
            <table ${style}>
                <tr>
                <th ${style}>Item name</th>
                <th ${style}>Variant</th>
                <th ${style}>Unit Price</th>
                <th ${style}>Quantity</th>
                <th ${style}>Subtotal(LKR)</th>
                </tr>
                ${cartRows}
            </table>
        </div>`;

        let emailBody = `
        <div style="width: 100%;">
            <div style="border-style: solid; padding: 15px; margin-left: auto; margin-right: auto; width:50%; overflow: auto;"> 
                <div>
                    <div style="text-align:center;">
                        <h1>TEXAS E STORES</h1> 
                    </div> 
                    <h2>Order Report</h2> 
                    <h3>Order No: ${orderId}</h3> 
                </div> 
                <hr /> 
                <div> 
                    <h4>Order Details</h4> 
                    <p>Order Date - Time: ${orderData.orderDateTime}</p> 
                    <table style="border:1px solid black;"> 
                        <tr> 
                            <td>Full name</td> 
                            <td>: </td> 
                            <td> ${orderData.orderName}</td> 
                        </tr> 
                        <tr> 
                            <td>Delivery address</td>
                            <td>: </td>  
                            <td> ${orderData.orderDeliveryAddress}</td> 
                        </tr> 
                        <tr> 
                            <td>ZIP code</td>
                            <td>: </td>  
                            <td> ${orderData.zipCode}</td> 
                        </tr> 
                        <tr> 
                            <td>Telephone</td>
                            <td>: </td>  
                            <td> ${orderData.orderTelephone}</td> 
                        </tr> 
                    </table> 
                </div>
                <hr />
                <div>
                    <h4>Order items</h4>
                    ${cart}
                    <div style="padding-top: 5px;">
                        <table style="border:1px solid black;"> 
                            <tr> 
                                <td>TOTAL: ${new Intl.NumberFormat(
                                    "en-LK",
                                    {
                                        style: "currency",
                                        currency: "LKR",
                                    }
                                ).format(orderTotal)}</td> 
                            </tr> 
                        </table> 
                    </div> 
                </div> 

                <hr />
                <div>
                    <h4>Payment Details</h4>
                    <table style="border:1px solid black;"> 
                        <tr> 
                            <td>Payment Method</td>
                            <td>: </td>  
                            <td> ${orderDetails[0].payment_method}</td> 
                        </tr> 
                        <tr> 
                            <td>Payment Status</td> 
                            <td>: </td> 
                            <td> ${orderDetails[0].payment_state}</td> 
                        </tr> 
                        <tr> 
                            <td>Payment Date - Time</td> 
                            <td>: </td> 
                            <td> ${
                                orderDetails[0].date_time
                                    ? DateTime.convertToLocalDateTime(
                                          orderDetails[0].date_time
                                      )
                                    : "PAYMENT PENDING"
                            }</td> 
                        </tr>  
                    </table> 
                </div>
                <hr />
                <div>
                    <h4>Delivery Details</h4>
                    <table style="border:1px solid black;"> 
                        <tr> 
                            <td>Delivery Method</td> 
                            <td>: </td> 
                            <td> ${orderDetails[0].delivery_method}</td> 
                        </tr> 
                        <tr> 
                            <td>Delivery Status</td> 
                            <td>: </td> 
                            <td> ${orderDetails[0].delivery_state}</td> 
                        </tr>
                    </table> 
                </div> 
            </div> 
        </div>`;

        EmailUtil.sendEmail(customerEmail, "TEXAS E STORES Order Report", emailBody, true);
    }
}

module.exports.EmailController = EmailController;
