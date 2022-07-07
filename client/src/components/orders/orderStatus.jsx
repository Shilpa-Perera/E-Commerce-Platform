import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateOrderStatus } from "../../services/orderService";
import Form from "../common/form";

export class OrderStatus extends Form {
    state = {
        initialPaymentState: null,
        orderId: null,
        data: {
            payment_status: "",
            delivery_state: "",
        },
        paymentMethod: null,
        errors: [],
    };

    schema = {
        payment_status: ["PAID", "PENDING"],
        delivery_state: ["PROCESSING", "OUT-FOR-DELIVERY", "DELIVERED"],
    };

    async componentDidMount() {
        const data = {
            payment_status: this.props.status.paymentState,
            delivery_state: this.props.status.deliveryState,
        };
        this.setState({
            data: data,
            orderId: this.props.orderId,
            paymentMethod: this.props.orderPaymentMethod,
            initialPaymentState: this.props.status.paymentState,
        });
    }

    async sendUpdate() {
        const result = await updateOrderStatus(this.state).then(
            (response) => response.data
        );
        if (result[0] === "Error Try Again !") {
            toast.error(result[0], {
                theme: "dark",
            });
            return;
        } else {
            this.setState({
                initialPaymentState: this.state.data.payment_status,
            });
            toast.success(result[0], {
                theme: "dark",
            });
        }
    }

    doSubmit = (event) => {
        this.sendUpdate();
        event.preventDefault();
    };

    render() {
        const { onUpdateValue } = this.props;
        return (
            <form className="container" onSubmit={this.doSubmit}>
                <div className="row mb-4  gx-5">
                    <div className="col-6">
                        {this.renderSelect(
                            "payment_status",
                            "Payment",
                            this.props.orderPaymentMethod !== "CARD"
                                ? [
                                    { id: "PENDING", name: "Pending" },
                                    { id: "PAID", name: "Paid" },
                                ]
                                : [{ id: "PAID", name: "Paid" }]
                        )}
                    </div>

                    <div className="col-6">
                        {" "}
                        {this.renderSelect("delivery_state", "Delivery", [
                            { id: "PROCESSING", name: "Processing" },
                            {
                                id: "OUT-FOR-DELIVERY",
                                name: "Out for delivery",
                            },
                            { id: "DELIVERED", name: "delivered" },
                        ])}
                    </div>
                </div>

                <div className="row gx-5">
                    <div className="col">
                        <div className="p-3">
                            <Link
                                className="btn btn-success col-12 hover-focus"
                                to="/orders"
                            >
                                {" "}
                                Orders{" "}
                                <i
                                    className="fa fa-shopping-basket"
                                    aria-hidden="true"
                                ></i>
                            </Link>
                        </div>
                    </div>
                    <div className="col">
                        <div className="p-3">
                            {this.renderStyledButtonwithOnclick(
                                "Update",
                                "btn btn-danger col-12 hover-focus", null, ()=>{onUpdateValue("x")}
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
    return <OrderStatus {...{ props, id }} />;
}

export default OrderUpdateState;
