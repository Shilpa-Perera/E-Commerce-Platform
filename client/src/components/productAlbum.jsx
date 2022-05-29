import React from "react";
import ProductCard from "./productCard";
import { Link } from "react-router-dom";

export default function ProductAlbum({ products }) {
    return (
        <div className="album pb-5">
            <div className="container">
                <div className="mb-3">
                    <h2 className="mb-3 d-inline-block">Products</h2>
                    <Link className="btn btn-primary h5 ms-3 hover-focus" to="/products/edit/new"><i className="fa fa-plus"></i><span className="ms-2">Add New</span></Link>
                </div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
                    {products.map((product) => (
                        <ProductCard data={product} key={product.product_id} />
                    ))}
                </div>
            </div>
        </div>
    );
}
