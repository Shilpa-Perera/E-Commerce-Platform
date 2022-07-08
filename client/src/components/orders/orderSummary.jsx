import { React } from "react";
import Form from "../common/form";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import { getOrder } from "../../services/orderService";
import { useParams, Link } from "react-router-dom";
import NotFound from "../notFound";
import Loading from "../common/loading";
import { getCurrentUser } from "../../services/authService";
import { stringDecrypt } from "../../utils/stringEncryptDecrypt";

//## Fix time to local timezone
class OrderSummary extends Form {
    state = {
        orderDetails: null,
        cart: null,
        loading: true,
    };

    async componentDidMount() {
        let orderId = null;
        const { id } = this.props;

        try {
            orderId = await stringDecrypt(id);
        } catch (error) {
            this.setState({ loading: false });
            return;
        }

        let customer_id = null;
        let user_id,
            role = null;
        try {
            const { user_id: user_id, role: role } = await getCurrentUser();
        } catch (e) {}

        const { data: s } = await getOrder(orderId);

        try {
            customer_id = s.orderDetails[0].customer_id;
        } catch (error) {
            this.setState({ loading: false });
            return;
        }

        if (role === "customer" && user_id !== customer_id) {
            this.setState({ loading: false });
            return;
        }
        if (s.orderCart.length === 0 || s.orderDetails.length === 0) {
            return;
        }
        this.setState({ orderDetails: s.orderDetails, cart: s.orderCart });
        this.setState({ loading: false });
    }

    printDocument() {
        const pdfTable = document.getElementById("divToPrint");
        var html = htmlToPdfmake(pdfTable.innerHTML);
        const documentDefinition = { content: html };
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        pdfMake.createPdf(documentDefinition).open();
    }

    calcOrderTotal(itemArray) {
        let total = 0;
        itemArray.map((e) => {
            total += e.price * e.number_of_items;
            return total;
        });
        return total;
    }

    render() {
        if (this.state.loading) return <Loading />;
        const { cart, orderDetails } = this.state;
        if (cart && orderDetails) {
            const orderDetails = this.state.orderDetails[0];
            return (
                <div className="container h-100 py-5">
                    <div className="row d-flex h-100">
                        <h2 className="d-inline-block">Order Summary</h2>

                        <div className="App container mt-3 card">
                            <div className="row align-items-start p-3">
                                <Link
                                    className="btn btn-danger col-1 p-1 m-1 hover-focus"
                                    to="/"
                                >
                                    <i
                                        className="fa fa-home"
                                        aria-hidden="true"
                                    ></i>
                                </Link>
                                <button
                                    className="btn btn-primary col-1 hover-focus p-1 m-1"
                                    onClick={this.printDocument}
                                >
                                    <i
                                        className="fa fa-print"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </div>
                            <div className="mb-5">
                                <div className="row d-flex justify-content-center pb-4">
                                    <div className="col-md-8">
                                        <div
                                            id="divToPrint"
                                            className="border rounded-3 p-3"
                                        >
                                            <div className="d-flex flex-row">
                                                <div className="d-flex flex-column">
                                                    <h3 className="justify-content-center">
                                                        TEXAS E STORE
                                                    </h3>{" "}
                                                    <h4 className="font-weight-bold h4">
                                                        Order Report
                                                    </h4>{" "}
                                                    <h5>
                                                        Order No:{" "}
                                                        {orderDetails.order_id}
                                                    </h5>{" "}
                                                </div>
                                            </div>
                                            <hr />
                                            <h6 className="h5">
                                                Order Details
                                            </h6>
                                            <div className="products ">
                                                <p className="">
                                                    Order Date - Time:{" "}
                                                    {orderDetails.date}
                                                </p>{" "}
                                                <table className="table table-borderless ">
                                                    <tbody>
                                                        <tr className="content">
                                                            <td className="col-6">
                                                                Full name
                                                            </td>
                                                            <td className="col-6">
                                                                {
                                                                    orderDetails.order_name
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr className="content">
                                                            <td className="col-6">
                                                                Delivery address
                                                            </td>
                                                            <td className="col-6">
                                                                {
                                                                    orderDetails.delivery_address
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr className="content">
                                                            <td className="col-6">
                                                                ZIP code
                                                            </td>
                                                            <td className="col-6">
                                                                {
                                                                    orderDetails.zip_code
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr className="content">
                                                            <td className="col-6">
                                                                Telephone
                                                            </td>
                                                            <td className="col-6">
                                                                {
                                                                    orderDetails.phone_number
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>{" "}
                                            <h6 className="h5">Order items</h6>
                                            <hr />
                                            <div className="products overflow-auto table-responsive checkout-cart-container summary-cart-container">
                                                <table className="table">
                                                    <tbody>
                                                        <tr className="add">
                                                            <td>Item name</td>
                                                            <td>Variant</td>
                                                            <td>Unit Price</td>
                                                            <td>Quantity</td>
                                                            <td className="text-center">
                                                                Subtotal(LKR)
                                                            </td>
                                                        </tr>
                                                        {cart.map((e) => {
                                                            return (
                                                                <tr
                                                                    key={
                                                                        e.variant_id
                                                                    }
                                                                    className="content"
                                                                >
                                                                    <td>
                                                                        {
                                                                            e.product_title
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            e.variant_name
                                                                        }
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {
                                                                            e.price
                                                                        }
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {
                                                                            e.number_of_items
                                                                        }
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {new Intl.NumberFormat(
                                                                            "en-LK",
                                                                            {
                                                                                style: "currency",
                                                                                currency:
                                                                                    "LKR",
                                                                            }
                                                                        ).format(
                                                                            e.price *
                                                                                e.number_of_items
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="address">
                                                <table className="table table-borderless">
                                                    <tbody>
                                                        <tr className="content">
                                                            <td className="h5">
                                                                {" "}
                                                                TOTAL :{" "}
                                                                {new Intl.NumberFormat(
                                                                    "en-LK",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "LKR",
                                                                    }
                                                                ).format(
                                                                    this.calcOrderTotal(
                                                                        cart
                                                                    )
                                                                )}
                                                                <br />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>{" "}
                                            <h6 className="h5">
                                                Payment Details
                                            </h6>
                                            <hr />
                                            <div className="address">
                                                <table className="table table-borderless">
                                                    <tbody>
                                                        <tr className="content">
                                                            <td>
                                                                {" "}
                                                                Payment Method :{" "}
                                                                {
                                                                    orderDetails.payment_method
                                                                }{" "}
                                                                <br /> Payment
                                                                Status :{" "}
                                                                {
                                                                    orderDetails.payment_state
                                                                }{" "}
                                                                <br />
                                                                Payment Date -
                                                                Time :{" "}
                                                                {orderDetails.date_time
                                                                    ? orderDetails.date_time
                                                                    : "PAYMENT PENDING"}{" "}
                                                                <br />{" "}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>{" "}
                                            <h6 className="h5">
                                                Delivery Details
                                            </h6>
                                            <hr />
                                            <div className="address">
                                                <table className="table table-borderless">
                                                    <tbody>
                                                        <tr className="content">
                                                            <td>
                                                                {" "}
                                                                Delivery Method
                                                                :{" "}
                                                                {
                                                                    orderDetails.delivery_method
                                                                }{" "}
                                                                <br /> Delivery
                                                                Status :{" "}
                                                                {
                                                                    orderDetails.delivery_state
                                                                }{" "}
                                                                <br />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return NotFound();
        }
    }
}

function OrderReport(props) {
    let { id } = useParams();

    return <OrderSummary {...{ props, id }} />;
}

export default OrderReport;
