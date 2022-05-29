import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Products from "./components/products";
import NavBar from "./components/navBar";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "./components/productForm";

function App() {
    return (
        <Fragment>
            <NavBar />
            <ToastContainer />
            <Routes>
                <Route path="/products">
                    <Route
                        index
                        element={<Products />}
                    ></Route>
                    <Route path="edit/:id" element={<ProductForm />}></Route>
                </Route>
            </Routes>
        </Fragment>
    );
}

export default App;
