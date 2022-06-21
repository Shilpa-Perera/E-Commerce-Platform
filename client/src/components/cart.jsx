import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getCartProducts } from "../services/cartService";
import CartCard from "./cartCard";
import { updateItemCount, deletedProduct,getCartId } from "../services/cartService";

class Cart extends Component {
    state = {
        variant: [],
        orderTotal: 0,
    };

    async cartProducts() {
        const { data: variant } = await getCartProducts(
            getCartId()
        );
        let orderTotal = 0;
        if (variant) {
            variant.forEach((element) => {
                orderTotal +=
                    parseFloat(element.price) * element.number_of_items;
            });
        }
        this.setState({ variant });
        this.setState({ orderTotal });
    }
    async componentDidMount() {
        await this.cartProducts();
    }

    handleIncrement = (variant_id) => {
        const products = [...this.state.variant];
        const index = products.findIndex(
            (item) => item.variant_id === variant_id
        );
        products[index].number_of_items++;
        this.setState({ variant: products });
        updateItemCount(
            products[index].cart_id,
            products[index].variant_id,
            products[index].number_of_items
        );
    };

    handleDecrement = (variant_id) => {
        const products = [...this.state.variant];
        const index = products.findIndex(
            (item) => item.variant_id === variant_id
        );
        products[index].number_of_items--;
        this.setState({ variant: products });

        updateItemCount(
            products[index].cart_id,
            products[index].variant_id,
            products[index].number_of_items
        );
    };

    handleDelete = async (cart_id,variant_id) => {
      await deletedProduct(cart_id, variant_id);
      await this.cartProducts();
      this.props.onDeleteFromCart() ;
      
    }


    render() {
        return (
            <div className="container h-100 py-5">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-10">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="d-inline-block">Shopping Cart</h3>
                            <div>
                                <p className="mb-0">
                                  {/* For sorting */}
                                </p>
                            </div>
                        </div>

                        {this.state.variant.length > 0 &&
                            this.state.variant.map((product) => (
                                <CartCard
                                    key={product.variant_id}
                                    cart_id={product.cart_id}
                                    variant_id={product.variant_id}
                                    title={product.product_title}
                                    variant_name={product.variant_name}
                                    price={product.price}
                                    image_name={product.image_name}
                                    number_of_items={product.number_of_items}
                                    onIncrement={this.handleIncrement}
                                    onDecrement={this.handleDecrement}
                                    onDelete={() =>
                                        this.handleDelete(
                                            product.cart_id,
                                            product.variant_id
                                        )
                                    }
                                />
                            ))}

                        <div className="card mb-5">
                            <div className="card-body p-4">
                                <div className="float-end">
                                    <p className="mb-0 me-5 d-flex align-items-center">
                                        <span className="small text-muted me-2">
                                            Order total:
                                        </span>{" "}
                                        <span className="lead fw-normal">
                                            {this.state.orderTotal}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-body">
                                <Link
                                    to={`/cart/checkout`}
                                    onClick={
                                        this.state.orderTotal === 0
                                            ? (event) => event.preventDefault()
                                            : ""
                                    }
                                >
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        disabled={
                                            this.state.orderTotal === 0
                                                ? "disabled"
                                                : ""
                                        }
                                    >
                                        Checkout
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cart;
