import React, { useEffect, useState } from "react";
import ProductAlbumGrid from "./products/productAlbumGrid";
import { getProducts } from "../services/productService";
import { toast } from "react-toastify";

function Home(props) {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const populateProducts = async () => {
            const { data: products } = await getProducts();
            if (products && products.length > 0) setProducts(products);
        };
        populateProducts().catch((e) => {
            console.log(e);
            toast.error("An error occurred!", { theme: "dark" });
        });
    },[]);

    return (
        <div className="container-fluid mb-5">
            <div className="row row-cols-1 row-cols-lg-2 mx-2 mb-5 px-3 bg-dark text-white py-5 shadow">
                <div className="col col-md-6 col-lg-8">
                    <div>
                        <h1 style={{ fontSize: "9vw", color: "white" }}>
                            Texas' Popular
                            <br />
                            E-store
                        </h1>
                    </div>
                </div>
                <div className="col col-md-6 col-lg-4">
                    <img
                        className="img-fluid p-3"
                        style={{ objectFit: "cover" }}
                        src={`${process.env.PUBLIC_URL}/logo512.png`}
                        alt="titleImg"
                    />
                </div>
            </div>
            <div className="row mx-2 mb-5 px-sm-1 px-md-3 py-5">
                <div className="p-5 div-dark">
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
