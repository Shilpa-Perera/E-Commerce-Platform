import React, { useEffect, useState } from "react";
import ProductAlbumGrid from "./productAlbumGrid";
import { getProducts } from "../services/productService";
import { toast } from "react-toastify";

function Home(props) {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const populateProducts = async() => {
            const { data: products } = await getProducts();
            if (products && products.length > 0)
                setProducts(products)
        }
        populateProducts().catch((e) => {
            console.log(e)
            toast.error("An error occurred!")
        });
    })

    return (
        <div className="container-fluid mb-5">
            <div className="row row-cols-1 row-cols-lg-2 mx-2 mb-5 px-3 bg-dark text-white py-5 shadow">
                <div className="col col-md-6 col-lg-8">
                    <div>
                        <h1 style={{fontSize: "9vw", color: "white"}}>Texas' Popular<br />E-store</h1>
                    </div>
                </div>
                <div className="col col-md-6 col-lg-4">
                    <img className="img-fluid p-3" style={{objectFit: "cover"}} src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="title-image"/>
                </div>
            </div>
            <div className="row mx-2 mb-5 px-sm-1 px-md-3 py-5">
                <div className="border border-2 p-5 rounded-3">
                    <div className="mb-5">
                        <h2>Products</h2>
                    </div>
                    <div className="px-sm-1 px-md-3 px-lg-5">
                        <ProductAlbumGrid products={products} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
