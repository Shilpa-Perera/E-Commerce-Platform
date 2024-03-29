import React from "react";
import { Link } from "react-router-dom";
import ProductAlbumGrid from "./productAlbumGrid";

export default function ProductAlbum({
    isAdmin,
    products,
    sortBy,
    sortOptions,
    orderOptions,
    onSortClick,
    onOptionClick,
}) {
    return (
        <div className="pb-5">
            <div className="container">
                <div className="mb-4 d-flex justify-content-between flex-column flex-lg-row">
                    <span>
                        <h2 className="d-inline-block">Products</h2>
                        {isAdmin && (
                            <Link
                                className="btn btn-primary h5 ms-3 hover-focus"
                                to="/products/edit/new"
                            >
                                <i className="fa fa-plus"></i>
                                <span className="ms-2">Add New</span>
                            </Link>
                        )}
                    </span>
                    <span>
                        <div className="table-responsive">
                            <table className="table table-borderless table-sm">
                                <tbody>
                                    <tr>
                                        <td>
                                            <h6 className="d-inline-block fw-bold me-2">
                                                Sort by
                                            </h6>
                                        </td>
                                        {sortOptions.map((option) => (
                                            <td key={option.id}>
                                                <div className="form-check form-check-inline">
                                                    <span
                                                        onClick={() =>
                                                            onSortClick(
                                                                option.id
                                                            )
                                                        }
                                                    >
                                                        <input
                                                            type="radio"
                                                            id={option.id}
                                                            name="sort"
                                                            checked={
                                                                sortBy.path ===
                                                                option.id
                                                            }
                                                            onChange={() => {}}
                                                            className="form-check-input"
                                                        />
                                                        <label
                                                            className="ms-1 form-check-label pointer hover-focus"
                                                            htmlFor={option.id}
                                                        >
                                                            {option.name}
                                                        </label>
                                                    </span>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td>
                                            <h6 className="d-inline-block fw-bold me-2">
                                                Order by
                                            </h6>
                                        </td>
                                        {orderOptions.map((option) => (
                                            <td key={option.id}>
                                                <div className="form-check form-check-inline">
                                                    <span
                                                        onClick={() =>
                                                            onOptionClick(
                                                                option.id
                                                            )
                                                        }
                                                    >
                                                        <input
                                                            type="radio"
                                                            id={option.id}
                                                            name="option"
                                                            checked={
                                                                sortBy.order ===
                                                                option.id
                                                            }
                                                            onChange={() => {}}
                                                            className="form-check-input"
                                                        />
                                                        <label
                                                            className="ms-1 form-check-label pointer hover-focus"
                                                            htmlFor={option.id}
                                                        >
                                                            {option.name}
                                                        </label>
                                                    </span>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </span>
                </div>
                <ProductAlbumGrid products={products} />
            </div>
        </div>
    );
}
