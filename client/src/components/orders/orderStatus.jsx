import { Joi } from "joi-browser";
import { updateOrderStatus } from "../../services/orderService";
import Form from "../common/form";
// ## WIP
export class OrderStatus extends Form {
    state = {
        loading: true,
        data: {
            payment_status: "",
            delivery_state: "",
        },

        errors: [],
    };
    

    // schema = {
    //     payment_status: Joi.string().validate(["PENDING", "PAID"]),
    //     delivery_state: Joi.validate(
    //        [ "PROCESSING",
    //         "OUTFORDELIVERY",
    //         "DELIVERED"]
    //     ),
    // };
    schema = {
        payment_status: ["x","y"],
        delivery_state: "x",
    };

    async componentDidMount() {
        const data = {
            payment_status: this.props.status.paymentState,
            delivery_state: this.props.status.deliveryState,
        };
        this.setState({ data: data });
    }

    update() {
        console.log(this.state);
    }

    doSubmit = async () => {
        console.log(await updateOrderStatus(this.state));
    };

    render() {
        const { data } = this.state;
        return (
            <form onSubmit={this.doSubmit}>
                {this.renderSelect("payment_status", "Payment status", [
                    { id: 1, name: "PENDING" },
                    { id: 2, name: "PAID" },
                ])}
                {this.renderSelect("delivery_state", "Delivery status", [
                    { id: 1, name: "PROCESSING" },
                    { id: 2, name: "OUTFORDELIVERY" },
                    { id: 3, name: "DELIVERED" },
                ])}
                <div> Payment status: {data.payment_status}</div>
                <div> Delivery status: {data.delivery_state}</div>
                {this.renderButton("Update")}
                <button>fff</button>
            </form>
        );
    }
}
