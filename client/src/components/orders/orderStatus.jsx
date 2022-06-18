import React, { Component } from "react";
// ## WIP
export class OrderStatus extends Component {
    render() {
        const { status } = this.props;
        return (
            <div>
                <div> Payment status: {status.paymentState}</div>
                <div> Delivery status: {status.deliveryState}</div>
            </div>
        );
    }
}
