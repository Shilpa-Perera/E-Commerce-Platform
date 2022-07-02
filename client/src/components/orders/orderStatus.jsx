import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateOrderStatus } from "../../services/orderService";
import Form from "../common/form";
// ## WIP
export class OrderStatus extends Form {
    state = {
        orderId: null,
        data: {
            payment_status: "",
            delivery_state: "",
        },

        errors: [],
    };

    schema = {
        payment_status: ["PAID", "PENDING"],
        delivery_state: ["PROCESSING", "OUTFORDELIVERY", "DELIVERED"],
    };

    async componentDidMount() {
        console.log();
        const data = {
            payment_status: this.props.status.paymentState,
            delivery_state: this.props.status.deliveryState,
        };
        this.setState({ data: data, orderId: this.props.orderId });
    }

    doSubmit = async () => {
        const result = await updateOrderStatus(this.state);
        toast.success("result[0]");
    };

    render() {
        const { data } = this.state;
        return (
            <form className="container" onSubmit={this.doSubmit}>
                <div className="row mb-4  gx-5">
                    <div className="col-6">
                        {this.renderSelect("payment_status", "Payment status", [
                            { id: "PENDING", name: "Pending" },
                            { id: "PAID", name: "Paid" },
                        ])}
                    </div>

                    <div className="col-6">
                        {" "}
                        {this.renderSelect(
                            "delivery_state",
                            "Delivery status",
                            [
                                { id: "PROCESSING", name: "Processing" },
                                {
                                    id: "OUTFORDELIVERY",
                                    name: "Out for delivery",
                                },
                                { id: "DELIVERED", name: "delivered" },
                            ]
                        )}
                    </div>
                </div>

                <div className="row gx-5">
                    <div className="col">
                        <div className="p-3">
                            <Link
                                className="btn btn-success col-12 hover-focus"
                                to="/orders"
                            >
                                <i
                                    className="fa fa-home"
                                    aria-hidden="true"
                                ></i>
                            </Link>
                        </div>
                    </div>
                    <div className="col">
                        <div className="p-3">
                            {this.renderStyledButton(
                                "Update",
                                "btn btn-danger col-12 hover-focus",
                                () => {
                                    <i
                                        className="fa fa-home"
                                        aria-hidden="true"
                                    ></i>;
                                }
                            )}
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

function OrderUpdateState(props) {
    const { id } = useParams();
    console.log(useParams());
    return <OrderStatus {...{ props, id }} />;
}

export default OrderUpdateState;
