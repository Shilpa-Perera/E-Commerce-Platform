import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Products from "./components/products/products";
import NavBar from "./components/navBar";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "./components/products/productForm";
import Footer from "./components/footer";
import Product from "./components/products/product";
import VariantForm from "./components/variants/variantForm";
import NotFound from "./components/notFound";
import Home from "./components/home";
import Orders from "./components/orders/orders";
import Order from "./components/orders/order";
import LoginForm from "./components/loginForm";
import CustomerForm from "./components/customer/customerForm";
import Logout from "./components/logout";
import Cart from "./components/cart/cart";
import VariantImages from "./components/variants/variantImages";
import ScrollToTop from "./components/scrollToTop";
import DeletedProduct from "./components/products/deletedProduct";
import ThemeSelector from "./components/themeSelector";
import UnavailableProducts from "./components/products/unavailableProducts";
import { getTheme, saveTheme } from "./utils/theme";
import { getCurrentUser } from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import {
	getItemCount,
	addProductToCart,
	setCartId,
	getCartId,
	removeCart,
} from "./services/cartService";
import { toast } from "react-toastify";
import ROLE from "./utils/roles.json";
import OrderCheckoutForm from "./components/orders/orderCheckout";
import CheckoutPayment from "./components/orders/checkoutPayment";
import CategoryForm from "./components/category/categoryForm";
import MockPaymentGateway from "./components/paymentGateway";
import Customers from "./components/customer/customers";
import CategoryLink from "./components/category/linkCategory";
import ProductInterestReportPage from "./components/reports/productInterestReport/productInterestReportPage";
import OrderReport from "./components/orders/orderSummary";
import QuaterlySalesReport from "./components/reports/quaterlySalesReport/quaterlySalesReport";
import MaxSaleProducts from "./components/reports/maxSaleProductsReport/maxSaleProductsReport";

import MostOrderCategories from "./components/reports/mostOrderCategoriesReport/mostOrderCategories";

function App() {
	const [theme, setTheme] = useState(getTheme());
	const [item_count, setItemCount] = useState();
	const [user, setUser] = useState();

	useEffect(() => {
		setUser(getCurrentUser());
		const fetchCount = async () => {
			const count = await getItemCount(getCartId());
			setItemCount(count);
		};
		fetchCount();
	}, []);

	return (
		<div className="d-flex flex-column min-vh-100">
			<ThemeSelector theme={theme} />
			<NavBar
				user={user}
				theme={theme}
				toggleTheme={(theme) => {
					setTheme(theme);
					saveTheme(theme);
				}}
				item_count={item_count}
			/>
			<ToastContainer />
			<Routes>
				<Route path="/products">
					<Route
						index
						element={
							<Products
								isAlbum={true}
								isTable={false}
								isReport={false}
								user={user}
							/>
						}
					></Route>

					<Route
						path="new"
						element={
							<ProtectedRoute permissions={[ROLE.ADMIN]}>
								<Navigate to="/products/edit/new" />
							</ProtectedRoute>
						}
					></Route>

					<Route
						path="unavailable"
						element={
							<ProtectedRoute permissions={[ROLE.ADMIN]}>
								<UnavailableProducts />
							</ProtectedRoute>
						}
					></Route>

					<Route path="deleted" element={<DeletedProduct />}></Route>

					<Route path=":id">
						<Route
							index
							element={
								<Product
									user={user}
									item_count={item_count}
									onAddToCart={async (variant_id) => {
										await setCartId();

										const cart_id = getCartId();
										const obj = {
											cart_id: cart_id,
											variant_id: variant_id,
										};
										const { data: result } =
											await addProductToCart(obj);
										let toast_msg = result.exist
											? "Item already in the cart !"
											: "Item added to cart !";
										result.exist
											? toast.warn(`${toast_msg}`, {
													theme: "dark",
											  })
											: toast.success(`${toast_msg}`, {
													theme: "dark",
											  });
										if (!result.exist) {
											const count = await getItemCount(
												cart_id
											);

											setItemCount(count);
										}
									}}
								/>
							}
						></Route>

						<Route path="variants">
							<Route
								index
								element={
									<ProtectedRoute permissions={[ROLE.ADMIN]}>
										<VariantForm />
									</ProtectedRoute>
								}
							></Route>

							<Route path=":v_id">
								<Route
									path="images"
									element={
										<ProtectedRoute
											permissions={[ROLE.ADMIN]}
										>
											<VariantImages />
										</ProtectedRoute>
									}
								></Route>
							</Route>
						</Route>
					</Route>

					<Route path="edit">
						<Route
							index
							element={
								<ProtectedRoute permissions={[ROLE.ADMIN]}>
									<Products
										isAlbum={false}
										isTable={true}
										isReport={false}
										user={user}
									/>
								</ProtectedRoute>
							}
						></Route>

						<Route
							path=":id"
							element={
								<ProtectedRoute permissions={[ROLE.ADMIN]}>
									<ProductForm />
								</ProtectedRoute>
							}
						></Route>
					</Route>
				</Route>

				<Route path="/categories">
					<Route
						path="new"
						element={
							<ProtectedRoute permissions={[ROLE.ADMIN]}>
								<CategoryForm />
							</ProtectedRoute>
						}
					></Route>
					<Route
						path="link-category"
						element={
							<ProtectedRoute permissions={[ROLE.ADMIN]}>
								<CategoryLink />
							</ProtectedRoute>
						}
					></Route>
				</Route>

				<Route path="/orders">
					<Route
						index
						element={
							<ProtectedRoute permissions={[ROLE.ADMIN]}>
								<Orders />
							</ProtectedRoute>
						}
					></Route>
					<Route
						path=":id"
						element={
							<ProtectedRoute permissions={[ROLE.ADMIN]}>
								<Order />
							</ProtectedRoute>
						}
					></Route>
				</Route>

				<Route
					path="/order-summary/:id"
					element={<OrderReport />}
				></Route>

				<Route path="/cart">
					<Route
						index
						element={
							<Cart
								item_count={item_count}
								onDeleteFromCart={async (cart_id) => {
									const count = await getItemCount(cart_id);

									setItemCount(count);
								}}
							/>
						}
					></Route>
					<Route path="checkout">
						<Route
							index
							element={
								<OrderCheckoutForm
									onCheckout={async () => {
										removeCart();
										setItemCount(0);
									}}
								/>
							}
						></Route>
					</Route>
				</Route>

				<Route
					path="/login"
					element={
						<LoginForm
							setUser={(user) => {
								setUser(user);
							}}
							onLogin={async (item_count) => {
								setItemCount(item_count);
							}}
						/>
					}
				></Route>
				<Route
					path="/logout"
					element={
						<Logout
							setUser={(user) => {
								setUser(user);
								setItemCount(0);
							}}
						/>
					}
				></Route>

				<Route path="/customers">
					{/* using permissions */}
					<Route
						exact
						path=""
						element={
							<ProtectedRoute permissions={[ROLE.ADMIN]}>
								<Customers />
							</ProtectedRoute>
						}
					></Route>

					<Route
						path=":id"
						element={
							<ProtectedRoute>
								<CustomerForm />
							</ProtectedRoute>
						}
					></Route>
					<Route path="orders">
						<Route
							index
							element={
								<ProtectedRoute>
									<Orders />
								</ProtectedRoute>
							}
						></Route>
						<Route
							path=":id"
							element={
								<ProtectedRoute>
									<OrderReport />
								</ProtectedRoute>
							}
						></Route>
					</Route>

					<Route path="register" element={<CustomerForm />}></Route>
				</Route>
				<Route
					path="/paymentGateway"
					element={<MockPaymentGateway />}
				></Route>

				<Route path="/reports">
					<Route path="products">
						<Route path="interest">
							<Route
								index
								element={
									<ProtectedRoute permissions={[ROLE.ADMIN]}>
										<Products
											isAlbum={false}
											isTable={false}
											isReport={true}
											user={user}
										/>
									</ProtectedRoute>
								}
							></Route>

							<Route
								path=":id"
								element={
									<ProtectedRoute permissions={[ROLE.ADMIN]}>
										<ProductInterestReportPage />
									</ProtectedRoute>
								}
							></Route>
						</Route>
					</Route>

					<Route
						path="quaterly-sales-report"
						element={
							<ProtectedRoute permissions={[ROLE.ADMIN]}>
								<QuaterlySalesReport />
							</ProtectedRoute>
						}
					></Route>
					<Route
						path="max-sale-products-report"
						element={
							<ProtectedRoute permissions={[ROLE.ADMIN]}>
								<MaxSaleProducts theme={theme} />
							</ProtectedRoute>
						}
					></Route>
					<Route
						path="most-order-categories"
						element={
							<ProtectedRoute permissions={[ROLE.ADMIN]}>
								<MostOrderCategories theme={theme} />
							</ProtectedRoute>
						}
					></Route>
				</Route>

				<Route path="/" element={<Home />}></Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
			<ScrollToTop />
			<Footer />
		</div>
	);
}

export default App;
