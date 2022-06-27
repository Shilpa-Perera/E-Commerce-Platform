import { React } from "react";
import Form from "../common/form";

import { toast } from "react-toastify";

import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

class OrderSummary extends Form {
    state = {
        data: {
            firstName: "",
            lastName: "",
            email: "",
            deliveryAddress: "",
            city: "",
            zipcode: "",
        },
        cartId: null,
        page: null,
        estimatedDelivery: null,
        errors: [],
    };

    componentDidMount() {
        console.log("run");
        // toast.success("Payment Successful", {
        //     theme: "dark",
        // });
    }

    printDocument() {
        const pdfTable = document.getElementById("divToPrint");
        var html = htmlToPdfmake(pdfTable.innerHTML);
        const documentDefinition = { content: html };
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        pdfMake.createPdf(documentDefinition).open();
    }

    render() {
        return (
            <div className="container h-100 py-5">
                <div className="row d-flex h-100">
                    <h3 className="d-inline-block">Order Summary</h3>

                    <div className="App container mt-5 card">
                        <div className="row align-items-start p-3">
                            <button
                                className="btn btn-danger col-1 p-1 m-1 hover-focus"
                            >
                               <i className="fa fa-home" aria-hidden="true"></i>
                            </button>
                            <button
                                className="btn btn-primary col-1 hover-focus p-1 m-1"
                                onClick={this.printDocument}
                            >
                               <i className="fa fa-print" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div className="m-3">
                            <div className="row d-flex justify-content-center">
                                <div className="col-md-8">
                                    <div id="divToPrint" className="border p-3">
                                        <div className="d-flex flex-row">
                                            <div className="d-flex flex-column">
                                                <h3 className="justify-content-center">
                                                    TEXAS E STORE
                                                </h3>{" "}
                                                <h4 className="font-weight-bold">
                                                    Order Report
                                                </h4>{" "}
                                                <h5>Order ID: 1023</h5>{" "}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="products ">
                                            <p className="">
                                                Order Date-Time: 2011/44/55
                                            </p>{" "}
                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr className="content">
                                                        <td className="col-6">
                                                            Full name
                                                        </td>
                                                        <td className="col-6">
                                                            Achira Dias
                                                        </td>
                                                    </tr>
                                                    <tr className="content">
                                                        <td className="col-6">
                                                            Delivery address
                                                        </td>
                                                        <td className="col-6">
                                                            293/E/1, 2ND LANE,
                                                            MANDAVILLA ROAD,
                                                            KESBAWA, PILIYANDALA
                                                        </td>
                                                    </tr>
                                                    <tr className="content">
                                                        <td className="col-6">
                                                            Telephone
                                                        </td>
                                                        <td className="col-6">
                                                            0112372728
                                                        </td>
                                                    </tr>
                                                    <tr className="content">
                                                        <td className="col-6">
                                                            Email
                                                        </td>
                                                        <td className="col-6">
                                                            achira@gmail.com
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>{" "}
                                        <h6 className="">Order items</h6>
                                        <hr />
                                        <div className="products overflow-auto">
                                            <table className="table">
                                                <tbody>
                                                    <tr className="add">
                                                        <td>Item name</td>
                                                        <td>Variant</td>
                                                        <td>Quantity</td>
                                                        <td className="text-center">
                                                            Subtotal(LKR)
                                                        </td>
                                                    </tr>
                                                    <tr className="content">
                                                        <td>
                                                            Asus VivoBook Pro
                                                        </td>
                                                        <td>
                                                            Black - 8GB - 1TB
                                                        </td>
                                                        <td className="text-center">
                                                            1
                                                        </td>
                                                        <td className="text-center">
                                                            250000.00
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="address">
                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr className="content">
                                                        <td>
                                                            {" "}
                                                            TOTAL (LKR) : 645000{" "}
                                                            <br />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        {" "}
                                        <h6 className="">Payment Details</h6>
                                        <hr />
                                        <div className="address">
                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr className="content">
                                                        <td>
                                                            {" "}
                                                            Payment Method :
                                                            Card <br /> Payment
                                                            Status : PAID <br />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        {" "}
                                        <h6 className="">Delivery Details</h6>
                                        <hr />
                                        <div className="address">
                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr className="content">
                                                        <td>
                                                            {" "}
                                                            Delivery Method :
                                                            Store-Pickup <br />{" "}
                                                            Delivery Status :
                                                            Delivered <br />
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
    }
}

export default OrderSummary;
