import React from "react";
import ProductCard from "./productCard";

function ProductAlbumGrid({products}) {
    return (
        <div className="album">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
                {products.map((product) => (
                    <ProductCard data={product} key={product.product_id} />
                ))}
            </div>
        </div>
    );
}

export default ProductAlbumGrid;