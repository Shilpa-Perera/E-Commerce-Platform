import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ data }) {
    const { product_id, product_title, price } = data;
    const image =
        "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4QWs8?ver=95ec&q=90&m=6&h=270&w=270&b=%23FFFFFFFF&f=jpg&o=f&aim=true";
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
                    ></img>
                </div>
                <div className="text-dark" style={{ width: "80%" }}>
                    <hr />
                </div>
                <div className="card-body">
                    <h5 className="card-title">{product_title}</h5>
                    <h6 className="card-subtitle my-2 text-muted">
                        RS. {price}
                    </h6>
                    <div className="d-flex justify-content-center align-items-center">
                        <Link to={`/products/${product_id}`}>
                            <button type="button" className="btn btn-primary my-2">
                                View
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
