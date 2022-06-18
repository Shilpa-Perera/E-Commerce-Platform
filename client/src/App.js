import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
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
import Cart from "./components/cart";
import VariantImages from "./components/variants/variantImages";
import ScrollToTop from "./components/scrollToTop";
import DeletedProduct from "./components/products/deletedProduct";
import ThemeSelector from "./components/themeSelector";
import UnavailableProducts from "./components/products/unavailableProducts";
import { getTheme, saveTheme } from "./services/themeService";
import { getCurrentUser } from "./services/authService";
import ProtectedRoute from './components/common/protectedRoute';

function App() {
    const [theme, setTheme] = useState(getTheme());
    const [user, setUser] = useState();

    useEffect(() => {
        console.log("set user");
        setUser(getCurrentUser());
    }, [])

    useEffect(() => {
        console.log("set user on change", user);
    }, user);

    // const login = (user) => {
    //     setUser(user);
    // }

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
            />
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

                    <Route
                        path="unavailable"
                        element={<UnavailableProducts />}
                    ></Route>

                    <Route path="deleted" element={<DeletedProduct />}></Route>

                    <Route path=":id">
                        <Route index element={<Product />}></Route>

                        <Route path="variants">
                            <Route index element={<VariantForm />}></Route>

                            <Route path=":v_id">
                                <Route
                                    path="images"
                                    element={<VariantImages />}
                                ></Route>
                            </Route>
                        </Route>
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

                <Route path="/orders">
                    <Route index element={<Orders />}></Route>
                    <Route path=":id" element={<Order />}></Route>
                </Route>

                <Route path="/cart" element={<Cart />}></Route>

                <Route path="/login" element={<LoginForm setUser={(user) => {setUser(user);}} />}></Route>
                <Route path="/logout" element={<Logout setUser={(user) => {setUser(user);}}/>}></Route>

                <Route path="/customers/*">
                    
                        <Route path=":id" element={
                            <ProtectedRoute><CustomerForm /></ProtectedRoute>
                        }></Route>
                    {/* <Route path=":id" element={
                            <CustomerForm />
                        }></Route> */}
                    
                    <Route path="register" element={<CustomerForm />}></Route>
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
