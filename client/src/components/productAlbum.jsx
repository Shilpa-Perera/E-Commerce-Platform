import React from "react";
import ProductCard from "./productCard";
import { Link } from "react-router-dom";

export default function ProductAlbum({
    products,
    sortBy,
    sortOptions,
    orderOptions,
    onSortClick,
    onOptionClick,
}) {
    return (
        <div className="album pb-5">
            <div className="container">
                <div className="mb-4 d-flex justify-content-between">
                    <span>
                        <h2 className="d-inline-block">Products</h2>
                        <Link
                            className="btn btn-primary h5 ms-3 hover-focus"
                            to="/products/edit/new"
                        >
                            <i className="fa fa-plus"></i>
                            <span className="ms-2">Add New</span>
                        </Link>
                    </span>
                    <span>
                        <div>
                            <h6 className="d-inline-block fw-bold">
                                Sort by:{" "}
                            </h6>
                            {sortOptions.map((option) => (
                                <div
                                    className="d-inline-block h6 ms-2"
                                    key={option.id}
                                >
                                    <span
                                        onClick={() => onSortClick(option.id)}
                                    >
                                        <input
                                            type="radio"
                                            id={option.id}
                                            name="sort"
                                            checked={sortBy.field === option.id}
                                        />
                                        <label
                                            className="ms-1"
                                            htmlFor={option.id}
                                        >
                                            {option.name}
                                        </label>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h6 className="d-inline-block fw-bold">
                                Order by:{" "}
                            </h6>
                            {orderOptions.map((option) => (
                                <div
                                    className="d-inline-block h6 ms-2"
                                    key={option.id}
                                >
                                    <span
                                        onClick={() => onOptionClick(option.id)}
                                    >
                                        <input
                                            type="radio"
                                            id={option.id}
                                            name="option"
                                            checked={sortBy.order === option.id}
                                        />
                                        <label
                                            className="ms-1"
                                            htmlFor={option.id}
                                        >
                                            {option.name}
                                        </label>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </span>
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
