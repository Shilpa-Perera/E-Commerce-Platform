import React, { useState } from "react";
import { Link } from "react-router-dom";
import { productImageUrl } from "../../services/imageService";

export default function ProductCard({ data }) {
    const { product_id, product_title, price, image_name } = data;
    const [image, setImage] = useState(productImageUrl(image_name));
    const [error, setError] = useState(false);

    const defaultImage = `${process.env.PUBLIC_URL}/logo512.png`;

    return (
        <div className="col" key={product_id}>
            <div
                className="card shadow text-center align-items-center h-100 hover-focus"
                style={{ borderRadius: "5%" }}
            >
                <div className="p-3">
                    <img
                        src={image}
                        className="card-img-top"
                        alt={product_title}
                        onError={() => {
                            if (!error) {
                                setImage(defaultImage);
                                setError(true);
                            }
                        }}
                    ></img>
                </div>
                <div className="text-dark" style={{ width: "80%" }}>
                    <hr className="hr-white" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">{product_title}</h5>
                    <h6 className="card-subtitle my-2 text-muted">
                        RS. {price}
                    </h6>
                    <div className="d-flex justify-content-center align-items-center">
                        <Link to={`/products/${product_id}`}>
                            <button
                                type="button"
                                className="btn btn-primary my-2"
                            >
                                View
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
