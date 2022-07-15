import React, { Component } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../../services/productService";
import { getVariant, getVariantById } from "../../services/variantService";
import Carousel from "../common/carousel";
import { variantImageUrl } from "../../services/imageService";
import Loading from "../common/loading";
import ProductEstimatedDelivery from "./productEstimatedDelivery";

class ProductBody extends Component {
    state = {
        loading: true,
        product: null,
        variant: null,
        selectedOptions: [],
        images: [],
        defaultVariantImages: [],
        item_count: this.props.item_count,
    };

    defaultImages = [`${process.env.PUBLIC_URL}/logo512.png`];

    async populateVariant(productArg = null, optionsArg = null) {
        const { id: product_id } = this.props;
        let { selectedOptions: options, product } = this.state;

        if (product === null) {
            product = productArg;
            options = optionsArg;
        }

        let variant = null;
        try {
            if (options.length > 0) {
                for (const option of options) {
                    if (option.value_id === 0) {
                        const images = [...this.state.defaultVariantImages];
                        this.setState({ variant, images });
                        return;
                    }
                }

                const { data } = await getVariant(product_id, options);
                variant = data;
            } else {
                const { data } = await getVariantById(
                    product.default_variant_id
                );
                variant = data;
            }

            let images = [];
            if (variant.variant_id !== 0 && variant.images.length > 0) {
                for (const { image_name } of variant.images) {
                    images.push(variantImageUrl(image_name));
                }
            } else {
                images = [...this.defaultImages];
            }

            this.setState({ variant, images });
        } catch (e) {
            if (e.response && e.response.status === 404)
                this.props.replace("/not-found");
        }
    }

    handleSelect = async ({ target }) => {
        const { id, value } = target;
        const option_id = parseInt(id);
        const value_id = parseInt(value);
        let selectedOptions = [...this.state.selectedOptions];

        for (let i = 0; i < selectedOptions.length; ++i) {
            if (selectedOptions[i].option_id === option_id) {
                selectedOptions[i].value_id = value_id;
                break;
            }
        }

        this.setState({ selectedOptions });

        await this.populateVariant();
    };

    async componentDidMount() {
        const { id } = this.props;

        try {
            const { data: product } = await getProduct(id);
            const selectedOptions = [];

            const { data: variant } = await getVariantById(
                product.default_variant_id
            );

            if (product.options.length > 0) {
                for (const { option_id } of product.options) {
                    selectedOptions.push({ option_id, value_id: 0 });
                }
            }

            let images = [];
            let defaultVariantImages = [];
            if (variant.images.length > 0) {
                for (const { image_name } of variant.images) {
                    const img = variantImageUrl(image_name);
                    images.push(img);
                    defaultVariantImages.push(img);
                }
            } else {
                images = [...this.defaultImages];
            }

            this.setState({
                product,
                selectedOptions,
                variant: null,
                images,
                defaultVariantImages,
            });

            await this.populateVariant(product, selectedOptions);
        } catch (e) {
            if (e.response && e.response.status === 404)
                this.props.replace("/not-found");

            await this.populateVariant();
        }
        this.setState({ loading: false });
    }

    render() {
        if (this.state.loading) return <Loading />;

        const { user, push } = this.props;
        const isAdmin = user && user.role === "admin";
        const isCustomer = !isAdmin;
        const isLoggedCustomer = user && user.role === "customer";

        const { product, variant, images } = this.state;
        if (product) {
            const { product_id } = product;
            const productAvailability = product.availability === "AVAILABLE";
            const variantAvailability = variant && variant.variant_id !== 0;

            const optionsAvailable =
                product.options && product.options.length > 0;
            const price = variant === null ? product.price : variant.price;
            const noVariant = variant === null ? true : null;
            const inStock =
                variant !== null && variant.quantity > 0 ? true : null;
            const outOfStock =
                variant !== null && variant.quantity <= 0 ? true : null;

            return (
                <div className="container-fluid mb-5">
                    <div className="row row-cols-1 row-cols-sm-1 row-cols-lg-2">
                        <div className="col mb-3 p-5">
                            <div
                                className="card shadow hover-focus p-3"
                                style={{ borderRadius: "3%" }}
                            >
                                <Carousel
                                    images={images}
                                    defaultImage={this.defaultImages[0]}
                                    id={`product-carousel`}
                                />
                            </div>
                            {isAdmin && variant && (
                                <div className="d-flex justify-content-center mt-5">
                                    <button
                                        className="btn btn-primary hover-focus"
                                        onClick={() =>
                                            push(
                                                `/products/${product_id}/variants/${variant.variant_id}/images`
                                            )
                                        }
                                    >
                                        <span className="me-2">Add Images</span>
                                        <i className="fa fa-image"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="col mb-3">
                            <div className="container">
                                <h2>{product.product_title}</h2>
                                <div className="mt-5 div-dark">
                                    <h5 className="text-muted mb-3">
                                        Features
                                    </h5>
                                    <div className="table-responsive">
                                        <table className="table table-borderless">
                                            <tbody>
                                                {product.custom_features.map(
                                                    (feature, index) => (
                                                        <tr key={index}>
                                                            <th scope="row">
                                                                {
                                                                    feature.custom_feature_name
                                                                }
                                                            </th>
                                                            <td>
                                                                {
                                                                    feature.custom_feature_val
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                                <tr>
                                                    <th scope="row">
                                                        Product weight
                                                    </th>
                                                    <td>
                                                        {product.product_weight}{" "}
                                                        grams
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {optionsAvailable && (
                                    <div className="div-dark mt-5 mb-3">
                                        <h5 className="text-muted">
                                            Select your options
                                        </h5>
                                        <div className="table-responsive">
                                            <table className="table table-borderless">
                                                <tbody>
                                                    {product.options.map(
                                                        (option, index) => (
                                                            <tr key={index}>
                                                                <th scope="row">
                                                                    {
                                                                        option.option_name
                                                                    }
                                                                </th>
                                                                <td>
                                                                    <select
                                                                        onChange={
                                                                            this
                                                                                .handleSelect
                                                                        }
                                                                        className="form-select"
                                                                        name={
                                                                            option.option_id
                                                                        }
                                                                        id={
                                                                            option.option_id
                                                                        }
                                                                    >
                                                                        <option
                                                                            value={
                                                                                0
                                                                            }
                                                                        ></option>
                                                                        {option.values.map(
                                                                            (
                                                                                value,
                                                                                idx
                                                                            ) => (
                                                                                <option
                                                                                    id={
                                                                                        value.value_id
                                                                                    }
                                                                                    value={
                                                                                        value.value_id
                                                                                    }
                                                                                    key={
                                                                                        idx
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        value.value_name
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                                {productAvailability && (
                                    <React.Fragment>
                                        {isLoggedCustomer &&
                                            variant &&
                                            variantAvailability && (
                                                <ProductEstimatedDelivery
                                                    addresses={
                                                        variant.addresses
                                                    }
                                                    availability={
                                                        variantAvailability
                                                    }
                                                    inStock={inStock}
                                                />
                                            )}
                                        <div className="d-flex flex-row-reverse mt-5">
                                            <div>
                                                <h4>
                                                    <span className="text-muted me-3">
                                                        {noVariant && "Base "}
                                                        Price:
                                                    </span>
                                                    Rs. {price}
                                                </h4>
                                            </div>
                                        </div>
                                        {variant &&
                                            variantAvailability &&
                                            isCustomer && (
                                                <div className="d-flex flex-row-reverse mt-5">
                                                    <div>
                                                        <button
                                                            className="btn btn-outline-success hover-focus"
                                                            onClick={() =>
                                                                this.props.onAddToCart(
                                                                    this.state
                                                                        .variant
                                                                        .variant_id
                                                                )
                                                            }
                                                        >
                                                            Add to cart
                                                            <span className="ms-2">
                                                                <i className="fa fa-cart-plus"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        {outOfStock && (
                                            <div className="container mt-5">
                                                <div
                                                    className="alert alert-warning d-flex align-items-center"
                                                    role="alert"
                                                >
                                                    <div className="bi flex-shrink-0 me-2">
                                                        <i className="fa fa-warning"></i>
                                                    </div>
                                                    <div>
                                                        Item is currently out of
                                                        stock!
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {isAdmin && (
                                            <div className="container mt-5">
                                                <div className="d-flex justify-content-end mb-2">
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-warning hover-focus"
                                                            onClick={() =>
                                                                push(
                                                                    `/products/edit/${product_id}/`
                                                                )
                                                            }
                                                        >
                                                            <span className="me-2">
                                                                Edit Product
                                                            </span>
                                                            <i className="fa fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-primary hover-focus"
                                                            onClick={() =>
                                                                push(
                                                                    `/products/${product_id}/variants/`
                                                                )
                                                            }
                                                        >
                                                            <span className="me-2">
                                                                Manage Variants
                                                            </span>
                                                            <i className="fa fa-gears"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-info hover-focus"
                                                            onClick={() =>
                                                                push(
                                                                    `/reports/products/interest/${product_id}`
                                                                )
                                                            }
                                                        >
                                                            <span className="me-2">
                                                                Interest Report
                                                            </span>
                                                            <i className="fa fa-bar-chart"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                )}
                                {!productAvailability && (
                                    <div className="container mt-5">
                                        <div
                                            className="alert alert-danger d-flex align-items-center"
                                            role="alert"
                                        >
                                            <div className="bi flex-shrink-0 me-2">
                                                <i className="fa fa-warning"></i>
                                            </div>
                                            <div>
                                                Item is currently unavailable!
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {variant && !variantAvailability && (
                                    <div className="container mt-5">
                                        <div
                                            className="alert alert-danger d-flex align-items-center"
                                            role="alert"
                                        >
                                            <div className="bi flex-shrink-0 me-2">
                                                <i className="fa fa-warning"></i>
                                            </div>
                                            <div>
                                                Selected variant is currently
                                                unavailable!
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else return null;
    }
}

function Product(props) {
    const { id } = useParams();
    const push = useNavigate();
    const replace = (path) => push(path, { replace: true });
    return <ProductBody {...{ ...props, id, push, replace }} />;
}

export default Product;
