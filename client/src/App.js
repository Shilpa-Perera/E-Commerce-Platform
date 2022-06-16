import { Route, Routes, Navigate } from "react-router-dom";
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
import RegisterForm from "./components/customer/registerForm";
import Logout from "./components/logout";
import Cart from "./components/cart";
import VariantImages from "./components/variants/variantImages";
import ScrollToTop from "./components/scrollToTop";
import DeletedProduct from "./components/products/deletedProduct";


function App() {
    
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <ToastContainer />
            <Routes>
                <Route path="/products">
                    <Route
                        index
                        element={<Products isAlbum={true} isTable={false} />}
                    ></Route>

                    <Route
                        path="new"
                        element={<Navigate to="/products/edit/new" />}
                    ></Route>

                    <Route path="deleted" element={<DeletedProduct />}></Route>

                    <Route path="variants">
                        <Route path=":id">
                            <Route
                                path="images"
                                element={<VariantImages />}
                            ></Route>
                        </Route>
                    </Route>

                    <Route path=":id">
                        <Route index element={<Product />}></Route>
                        <Route path="variants" element={<VariantForm />} />
                    </Route>

                    <Route path="edit">
                        <Route
                            index
                            element={
                                <Products isAlbum={false} isTable={true} />
                            }
                        ></Route>

                        <Route path=":id" element={<ProductForm />}></Route>
                    </Route>
                </Route>

                <Route path="/orders" >
                    <Route index element={<Orders />}></Route>
                    <Route path=":id" element={<Order />}></Route>
                </Route>

                <Route path="/cart" element={<Cart cart_id = {localStorage.getItem("cart_id")}/>}></Route>

                <Route path="/login" element={<LoginForm />}></Route>
                <Route path="/logout" element={<Logout />}></Route>

                <Route path="/customers/*">
                    <Route path="register" element={<RegisterForm />}></Route>
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
