import React, { Component } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../../services/productService";
import { getVariant, getVariantById } from "../../services/variantService";
import Carousel from "../common/carousel";
import { toast } from "react-toastify";
import { variantImageUrl } from "../../services/imageService";

class ProductBody extends Component {
    state = {
        product: null,
        variant: null,
        selectedOptions: [],
        images: [],
    };

    async populateVariant() {
        const { id: product_id } = this.props;
        let { selectedOptions: options } = this.state;

        if (options.length > 0) {
            for (const option of options) {
                if (option.value_id === 0) {
                    return;
                }
            }

            try {
                const { data: variant } = await getVariant(product_id, options);

                let images = [];
                if (variant.images.length > 0) {
                    for (const { image_name } of variant.images) {
                        images.push(variantImageUrl(image_name));
                    }
                } else {
                    images = [
                        "https://c.s-microsoft.com/en-us/CMSImages/1920_Panel03_DeviceFamily_Pro7Plus.jpg?version=f4411094-f2e1-b89b-41d1-4517624580ae",
                        "https://c.s-microsoft.com/en-us/CMSImages/Surface_F21_DeviceFamily_Studio2_V1_Blackfriday.jpg?version=72d8410c-3280-67f2-5c7a-c516caa6c728",
                        "https://c.s-microsoft.com/en-us/CMSImages/Surface_F21_DeviceFamily_Laptop4_V1_Blackfriday.jpg?version=4258b51c-655a-37d6-fbd3-b8138d84dcae",
                    ];
                }

                this.setState({ variant, images });
            } catch (e) {
                if (e.response && e.response.status === 404)
                    this.props.replace("/not-found");
            }
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

    handleAddToCart = () => {
        toast.success("Item added to cart!", { theme: "dark" });
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
            if (variant.images.length > 0) {
                for (const { image_name } of variant.images) {
                    images.push(variantImageUrl(image_name));
                }
            } else {
                images = [
                    "https://c.s-microsoft.com/en-us/CMSImages/1920_Panel03_DeviceFamily_Pro7Plus.jpg?version=f4411094-f2e1-b89b-41d1-4517624580ae",
                    "https://c.s-microsoft.com/en-us/CMSImages/Surface_F21_DeviceFamily_Studio2_V1_Blackfriday.jpg?version=72d8410c-3280-67f2-5c7a-c516caa6c728",
                    "https://c.s-microsoft.com/en-us/CMSImages/Surface_F21_DeviceFamily_Laptop4_V1_Blackfriday.jpg?version=4258b51c-655a-37d6-fbd3-b8138d84dcae",
                ];
            }

            this.setState({ product, selectedOptions, variant, images });
        } catch (e) {
            if (e.response && e.response.status === 404)
                this.props.replace("/not-found");
        }
        await this.populateVariant();
    }

    render() {
        const { product, variant, images } = this.state;

        if (product) {
            const optionsAvailable =
                product.options && product.options.length > 0;
            const price = variant === null ? product.price : variant.price;
            const noVariant = variant === null ? true : null;
            const inStock =
                variant !== null && variant.quantity > 0 ? true : null;
            const outOfStock = inStock ? null : true;

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
                                    id={`product-carousel`}
                                />
                            </div>
                        </div>
                        <div className="col mb-3">
                            <div className="container">
                                <h2>{product.product_title}</h2>
                                <div className="mt-5 div-dark">
                                    <h5 className="text-muted mb-3">
                                        Features
                                    </h5>
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
                                {optionsAvailable && (
                                    <div className="div-dark mt-5 mb-3">
                                        <h5 className="text-muted">
                                            Select your options
                                        </h5>
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
                                )}
                                <div className="d-flex flex-row-reverse mt-5">
                                    <div>
                                        <h4>
                                            <span className="text-muted me-3">
                                                {noVariant && "Base "}Price:
                                            </span>
                                            Rs. {price}
                                        </h4>
                                    </div>
                                </div>

                                {variant && inStock && (
                                    <div className="d-flex flex-row-reverse mt-5">
                                        <div>
                                            <button
                                                className="btn btn-outline-success hover-focus"
                                                onClick={this.handleAddToCart}
                                            >
                                                Add to cart
                                                <span className="ms-2">
                                                    <i className="fa fa-cart-plus"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {variant && outOfStock && (
                                    <div className="container mt-5">
                                        <div
                                            className="alert alert-danger d-flex align-items-center"
                                            role="alert"
                                        >
                                            <div className="bi flex-shrink-0 me-2">
                                                <i className="fa fa-warning"></i>
                                            </div>
                                            <div>
                                                Item is currently out of stock!
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
