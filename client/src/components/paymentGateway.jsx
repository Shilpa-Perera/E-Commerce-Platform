import React, { Component } from "react";


class MockPaymentGateway extends Component {
    render() {
        return (
            <div>
                <h1>
                    This is a mock Payment gateway
                </h1>
                <p> Click "Successful" for successful Payment.
                    "Fail" to demo Failed Payment</p>
                <button>Successful</button>
                <button>Fail</button>
            </div>
        );
    }
}

export default MockPaymentGateway;
