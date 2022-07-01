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

class OrderSummary extends Form {
    state = {
        orderDetails: null,
        cart: null,
        loading: true,
    };

    async componentDidMount() {
        let customer_id = null;
        const { user_id, role } = await getCurrentUser();
        const { id } = this.props;
        const { data: s } = await getOrder(id);
        try {
            customer_id = s.orderDetails[0].customer_id;
        } catch (error) {}

        console.log(s, user_id, customer_id, role);
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
                        <h3 className="d-inline-block">Order Summary</h3>

                        <div className="App container mt-5 card">
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
                            <div className="m-3">
                                <div className="row d-flex justify-content-center">
                                    <div className="col-md-8">
                                        <div
                                            id="divToPrint"
                                            className="border p-3"
                                        >
                                            <div className="d-flex flex-row">
                                                <div className="d-flex flex-column">
                                                    <h3 className="justify-content-center">
                                                        TEXAS E STORE
                                                    </h3>{" "}
                                                    <h4 className="font-weight-bold">
                                                        Order Report
                                                    </h4>{" "}
                                                    <h5>
                                                        Order No:{" "}
                                                        {orderDetails.order_id}
                                                    </h5>{" "}
                                                </div>
                                            </div>
                                            <hr />
                                            <h6 className="">Order Details</h6>
                                            <div className="products ">
                                                <p className="">
                                                    Order Date-Time:{" "}
                                                    {orderDetails.date}
                                                </p>{" "}
                                                <table className="table table-borderless">
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
                                            <h6 className="">Order items</h6>
                                            <hr />
                                            <div className="products overflow-auto table-responsive checkout-cart-container">
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
                                                            <td>
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
                                            <h6 className="">
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
                                                                Payment Date :{" "}
                                                                {
                                                                    orderDetails.date_time
                                                                }{" "}
                                                                <br />{" "}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>{" "}
                                            <h6 className="">
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
    const { id } = useParams();
    return <OrderSummary {...{ props, id }} />;
}

export default OrderReport;
