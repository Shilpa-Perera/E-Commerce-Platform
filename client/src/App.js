import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Products from "./components/products";
import NavBar from "./components/navBar";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "./components/productForm";
import Footer from "./components/footer";
import Product from "./components/product";
import VariantForm from "./components/variantForm";

function App() {
    return (
        <Fragment>
            <NavBar />
            <ToastContainer />
            <Routes>
                <Route path="/products">
                    <Route index element={<Products />}></Route>
                    <Route path=":id">
                        <Route index element={<Product />}></Route>
                        <Route path="variants" element={<VariantForm />} />
                    </Route>
                    <Route path="edit/:id" element={<ProductForm />}></Route>
                </Route>
            </Routes>
            <Footer />
        </Fragment>
    );
}

export default App;
