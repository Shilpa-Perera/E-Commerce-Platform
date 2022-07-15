import React, { useState, useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import { getCartProducts, getCartId } from "../../services/cartService";

import CartCanvasCard from "./cartCanvasCard";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";

export default function CartCanvas({ show, handleClose }) {
	const [products, setProducts] = useState([]);
	useEffect(() => {
		const fetchCartProducts = async () => {
			const { data: variant } = await getCartProducts(getCartId());

			setProducts(variant);
		};
		fetchCartProducts();
	}, []);
	return (
		<>
			<Offcanvas show={show} onHide={handleClose} placement="end">
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>
						<h3 className="text-center">Shopping Cart</h3>
					</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					{products.length > 0 && (
						<div>
							{products.map((product) => (
								<CartCanvasCard
									key={product.variant_id}
									title={product.product_title}
									variant_name={product.variant_name}
									price={product.price}
									image_name={product.image_name}
									number_of_items={product.number_of_items}
								/>
							))}
							<div className="d-flex justify-content-center p-50">
								<Link to="/cart">
									<button
										type="button"
										className="btn btn-outline-secondary"
										onClick={handleClose}
									>
										View Cart
										<BsFillArrowUpRightCircleFill
											style={{ marginLeft: 10 }}
										/>
									</button>
								</Link>
							</div>
						</div>
					)}
					{!products.length && (
						<div>
							<p className="fs-5 text-center fw-bold mt-5">
								Currently no items in the cart
							</p>
							<div className="d-flex justify-content-center p-50">
								<MdAddShoppingCart
									size={100}
									style={{ color: "grey" }}
								/>
							</div>
							<div className="d-flex justify-content-center p-50">
								<Link to="/products">
									<button
										type="button"
										className="btn btn-outline-primary"
										onClick={handleClose}
									>
										Continue Shopping
										<IoArrowForward
											style={{ marginLeft: 10 }}
										/>
									</button>
								</Link>
							</div>
						</div>
					)}
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
}
