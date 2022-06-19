import React from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../common/form";
import { getCategories } from "../../services/categoryService";
import {
    getProduct,
    putProductImage,
    saveProduct,
} from "../../services/productService";
import { Collapse } from "bootstrap";
import OptionForm from "./optionForm";
import CustomFeaturesForm from "./customFeaturesForm";
import TableHeader from "../common/tableHeader";
import {
    deleteCustomFeature,
    saveCustomFeature,
    updateCustomFeature,
} from "../../services/customFeatureService";
import EditCustomFeaturesForm from "./editCustomFeatureForm";
import _ from "lodash";
import AddImage from "../addImage";
import { productImageUrl } from "../../services/imageService";
import ProductCategoryForm from "./productCategoryForm";
import {
    deleteProductCategory,
    saveProductCategory,
} from "../../services/productCategoryService";

class ProductFormBody extends Form {
    state = {
        data: {
            product_id: 0,
            product_title: "",
            sku: "",
            product_weight: "",
            custom_features: [],
            product_categories: [],
            options: [],
            image_name: "",
        },
        categories: [],
        current_product_categories: [],
        current_custom_features: [],
        current_options: [],
        isNew: false,
        edit_custom_feature: {},
        product_image_url: "",
        product_image: null,
        errors: {},
    };

    option_columns = [
        { path: "option_name", label: "Name" },
        { path: "values", label: "Values" },
    ];

    custom_features_columns = [
        { path: "custom_feature_name", label: "Name" },
        { path: "custom_feature_val", label: "Value" },
        { key: "edit", label: "" },
    ];

    product_category_columns = [
        { path: "category_name", label: "Category" },
        { path: "sub_category_name", label: "Subcategory" },
        { key: "edit", label: "" },
    ];

    schema = {
        product_id: Joi.number(),
        product_title: Joi.string()
            .required()
            .min(3)
            .max(250)
            .label("Product Title"),
        sku: Joi.string().required().min(5).max(30).label("SKU"),
        product_weight: Joi.number().required().min(1).label("Product Weight"),
        custom_features: Joi.array(),
        product_categories: Joi.array(),
        options: Joi.array(),
        isNew: Joi.bool(),
        image_name: Joi.string().allow(""),
    };

    async populateCategories() {
        const { data: categories } = await getCategories();
        this.setState({ categories });
    }

    async populateProduct() {
        try {
            const productId = this.props.id;
            if (productId === "new") {
                const isNew = true;
                this.setState({ isNew });
                if (this.option_columns.length === 2)
                    this.option_columns.push({
                        key: "actions_op",
                        label: "Actions",
                    });
                return;
            }

            const { data: product } = await getProduct(productId);

            if (product.availability === "UNAVAILABLE")
                this.props.replace("/products/deleted");

            const data = _.pick(product, [
                "product_id",
                "product_title",
                "sku",
                "product_weight",
                "custom_features",
                "product_categories",
                "options",
                "image_name",
            ]);
            const current_custom_features = data.custom_features;
            const current_product_categories = data.product_categories;
            const current_options = data.options;
            data.custom_features = [];
            data.product_categories = [];
            data.options = [];
            data.product_id = productId;

            const { image_name } = product;
            const product_image_url =
                image_name === null ? "" : productImageUrl(image_name);

            this.setState({
                data,
                current_custom_features,
                current_product_categories,
                current_options,
                product_image_url,
            });
        } catch (e) {
            if (e.response && e.response.status === 404)
                this.props.replace("/not-found");
        }
    }

    async componentDidMount() {
        await this.populateCategories();
        await this.populateProduct();
    }

    addOption = (option) => {
        if (this.state.isNew) {
            const data = { ...this.state.data };
            data.options.push(option);
            this.setState({ data });
        } else {
            const current_options = { ...this.state.current_options };
            current_options.push(option);
        }
    };

    addCustomFeature = async (customFeature) => {
        if (this.state.isNew) {
            const data = { ...this.state.data };
            data.custom_features.push(customFeature);
            this.setState({ data });
        } else {
            const current_custom_features = [
                ...this.state.current_custom_features,
            ];
            const originalFeatures = [...current_custom_features];
            current_custom_features.push(customFeature);
            this.setState({ current_custom_features });

            try {
                await saveCustomFeature(
                    customFeature,
                    this.state.data.product_id
                );
            } catch (ex) {
                toast.error("An error occurred while saving the feature.", {
                    theme: "dark",
                });
                this.setState({ current_custom_features: originalFeatures });
            }
        }
    };

    handleAddProductCategory = async (productCategory) => {
        if (this.state.isNew) {
            const data = { ...this.state.data };
            data.product_categories.push(productCategory);
            this.setState({ data });
        } else {
            const current_product_categories = [
                ...this.state.current_product_categories,
            ];
            const originalProductCategories = [...current_product_categories];
            current_product_categories.push(productCategory);
            this.setState({ current_product_categories });

            try {
                await saveProductCategory(productCategory, this.props.id);
            } catch (ex) {
                console.log(ex);
                toast.error("An error occurred while saving the category.", {
                    theme: "dark",
                });
                this.setState({
                    current_product_categories: originalProductCategories,
                });
            }
        }
    };

    handleEditCustomFeature = (customFeature) => {
        this.setState({ edit_custom_feature: customFeature });
        const collapse = document.getElementById("collapseTarget");
        const bsCollapse = new Collapse(collapse, { toggle: false });
        bsCollapse.show();
    };

    handleDeleteCustomFeature = async (customFeature) => {
        const index = customFeature.index;
        if (this.state.isNew) {
            const data = { ...this.state.data };
            data.custom_features.splice(index, 1);
            this.setState({ data, edit_custom_feature: {} });
        } else {
            const current_custom_features = [
                ...this.state.current_custom_features,
            ];
            const originalFeatures = [...current_custom_features];
            const custom_feature_id = customFeature.custom_feature_id;
            current_custom_features.splice(index, 1);
            this.setState({ current_custom_features, edit_custom_feature: {} });

            try {
                await deleteCustomFeature(custom_feature_id);
            } catch (ex) {
                toast.error("An error occurred while deleting the feature.", {
                    theme: "dark",
                });
                this.setState({ current_custom_features: originalFeatures });
            }
        }
    };

    handleDeleteProductCategory = async (productCategory) => {
        const index = productCategory.index;
        if (this.state.isNew) {
            const data = { ...this.state.data };
            data.product_categories.splice(index, 1);
            this.setState({ data });
        } else {
            const current_product_categories = [
                ...this.state.current_product_categories,
            ];
            const originalProductCategories = [...current_product_categories];
            current_product_categories.splice(index, 1);
            this.setState({
                current_product_categories,
                edit_custom_feature: {},
            });

            try {
                const { category_id, sub_category_id } = productCategory;
                await deleteProductCategory(
                    this.state.data.product_id,
                    category_id,
                    sub_category_id
                );
            } catch (ex) {
                toast.error("An error occurred while deleting the category.", {
                    theme: "dark",
                });
                this.setState({
                    current_product_categories: originalProductCategories,
                });
            }
        }
    };

    updateCustomFeature = async (customFeature) => {
        const index = this.state.edit_custom_feature.index;
        if (this.state.isNew) {
            const data = { ...this.state.data };
            data.custom_features[index] = customFeature;
            this.setState({ data, edit_custom_feature: {} });
        } else {
            const current_custom_features = [
                ...this.state.current_custom_features,
            ];
            const originalFeatures = [...current_custom_features];
            const custom_feature_id =
                this.state.edit_custom_feature.custom_feature_id;
            customFeature.custom_feature_id = custom_feature_id;
            current_custom_features[index] = customFeature;
            delete customFeature.index;
            this.setState({ current_custom_features, edit_custom_feature: {} });

            try {
                await updateCustomFeature(customFeature, custom_feature_id);
            } catch (ex) {
                toast.error("An error occurred while updating the feature.", {
                    theme: "dark",
                });
                this.setState({ current_custom_features: originalFeatures });
            }
        }
        const collapse = document.getElementById("collapseTarget");
        const bsCollapse = new Collapse(collapse, { toggle: false });
        bsCollapse.hide();
    };

    cancelEditCustomFeature = () => {
        this.setState({ edit_custom_feature: {} });
        const collapse = document.getElementById("collapseTarget");
        const bsCollapse = new Collapse(collapse, { toggle: false });
        bsCollapse.hide();
    };

    handleDeleteOption = (index) => {
        if (this.state.isNew) {
            const data = { ...this.state.data };
            data.options.splice(index, 1);
            this.setState({ data });
        }
    };

    doSubmit = async () => {
        const { isNew, product_image } = this.state;
        if (!isNew) {
            const { data } = await saveProduct(this.state.data);
            const { product_id } = data;
            return this.props.push(`/products/${product_id}/variants`);
        } else if (
            product_image !== null &&
            this.state.data.product_categories.length > 0
        ) {
            const { data } = await saveProduct(this.state.data);
            const { product_id } = data;
            await putProductImage(product_id, this.state.product_image);
            return this.props.push(`/products/${product_id}/variants`);
        }

        if (product_image === null) {
            toast.warn("Product image is not added!", { theme: "dark" });
        }

        if (this.state.data.product_categories.length === 0) {
            toast.warn("Select at least one category!", { theme: "dark" });
        }
    };

    handleSaveImage = async (newImageUrl, newImage) => {
        const { product_image_url: originalUrl, isNew } = { ...this.state };
        const { product_id } = this.state.data;
        try {
            console.log(newImageUrl, newImage);
            this.setState({
                product_image_url: newImageUrl,
                product_image: newImage,
            });

            if (!isNew) {
                const { data: file } = await putProductImage(
                    product_id,
                    newImage
                );
                const { filename } = file;
                const data = { ...this.state.data };
                data.image_name = filename;
                const product_image_url = productImageUrl(filename);
                this.setState({ data, product_image_url });
            }
        } catch (e) {
            console.error(e);
            toast.error("Could not upload image", { theme: "dark" });
            this.setState({ product_image_url: originalUrl });
        }
    };

    handleRemoveImage = () => {
        const product_image_url = productImageUrl(this.state.data.image_name);
        this.setState({ product_image_url });
    };

    render() {
        let categories = [];
        for (const category of this.state.categories) {
            categories.push({
                id: category.category_id,
                name: category.category_name,
            });
        }

        const imageAvailable = this.state.product_image_url !== "";

        return (
            <div className="container mb-5">
                <div className="p-4">
                    <h1>
                        {this.state.isNew
                            ? "New Product"
                            : this.state.data.product_title}
                    </h1>
                </div>
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 p-5 div-dark">
                    <div className="col mb-3">
                        <form onSubmit={this.handleSubmit}>
                            {this.renderInput("product_title", "Product Title")}
                            {this.renderInput("sku", "SKU")}
                            {this.renderInput(
                                "product_weight",
                                "Product Weight",
                                "number"
                            )}
                            {this.state.isNew && (
                                <div className="alert alert-warning">
                                    <i className="fa fa-warning"></i>
                                    <span className="ms-2">
                                        Make sure to add all the options for
                                        variants before saving!
                                    </span>
                                </div>
                            )}
                            {this.renderStyledButton(
                                "Save",
                                "hover-focus",
                                () => (
                                    <i className="fa fa-save"></i>
                                )
                            )}
                        </form>
                    </div>
                    <div className="col justify-content-center mb-3">
                        {imageAvailable && (
                            <div>
                                <div className="d-flex justify-content-center mb-3">
                                    <img
                                        alt="not fount"
                                        width="400px"
                                        src={this.state.product_image_url}
                                    />
                                </div>
                                <div className="d-flex justify-content-center mb-3">
                                    <button
                                        className="btn btn-warning hover-focus"
                                        onClick={() => {
                                            this.setState({
                                                product_image_url: "",
                                            });
                                        }}
                                    >
                                        Change
                                        <span className="ms-2">
                                            <i className="fa fa-edit"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                        {!imageAvailable && (
                            <AddImage
                                saveImage={this.handleSaveImage}
                                removeImage={this.handleRemoveImage}
                                aspectRatio={1}
                            />
                        )}
                    </div>
                </div>
                <div className="mt-5 div-dark">
                    <h3>Product Categories</h3>
                    <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                        <div className="col mb-3">
                            <table className="table table-hover">
                                <TableHeader
                                    columns={this.product_category_columns}
                                    sortColumn={null}
                                />
                                <tbody>
                                    {this.state.current_product_categories.map(
                                        (productCategory, index) => {
                                            productCategory.index = index;
                                            return (
                                                <tr key={"1-" + index}>
                                                    <td>
                                                        {
                                                            productCategory.category_name
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            productCategory.sub_category_name
                                                        }
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger hover-focus"
                                                            onClick={() =>
                                                                this.handleDeleteProductCategory(
                                                                    productCategory
                                                                )
                                                            }
                                                        >
                                                            <i className="fa fa-fw fa-trash-o"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                    {this.state.data.product_categories.map(
                                        (productCategory, index) => {
                                            productCategory.index = index;
                                            return (
                                                <tr key={"2-" + index}>
                                                    <td>
                                                        {
                                                            productCategory.category_name
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            productCategory.sub_category_name
                                                        }
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger hover-focus"
                                                            onClick={() =>
                                                                this.handleDeleteProductCategory(
                                                                    productCategory
                                                                )
                                                            }
                                                        >
                                                            <i className="fa fa-fw fa-trash-o"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="col mt-3">
                            <ProductCategoryForm
                                categories={categories}
                                onSubmit={this.handleAddProductCategory}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-5 div-dark">
                    <h3>Custom Features</h3>
                    <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                        <div className="col mb-3">
                            <table className="table table-hover">
                                <TableHeader
                                    columns={this.custom_features_columns}
                                    sortColumn={null}
                                />
                                <tbody>
                                    {this.state.current_custom_features.map(
                                        (feature, index) => {
                                            feature.index = index;
                                            return (
                                                <tr key={"1-" + index}>
                                                    <td>
                                                        {
                                                            feature.custom_feature_name
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            feature.custom_feature_val
                                                        }
                                                    </td>
                                                    <td>
                                                        <div
                                                            className="btn-group btn-group-sm"
                                                            role="toolbar"
                                                            aria-label="Actions Toolbar"
                                                        >
                                                            <button
                                                                className="btn btn-warning hover-focus"
                                                                onClick={() =>
                                                                    this.handleEditCustomFeature(
                                                                        feature
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa fa-fw fa-pencil-square-o"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-danger hover-focus"
                                                                onClick={() =>
                                                                    this.handleDeleteCustomFeature(
                                                                        feature
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa fa-fw fa-trash-o"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                    {this.state.data.custom_features.map(
                                        (feature, index) => {
                                            feature.index = index;
                                            return (
                                                <tr key={"2-" + index}>
                                                    <td>
                                                        {
                                                            feature.custom_feature_name
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            feature.custom_feature_val
                                                        }
                                                    </td>
                                                    <td>
                                                        <div
                                                            className="btn-group btn-group-sm"
                                                            role="toolbar"
                                                            aria-label="Actions Toolbar"
                                                        >
                                                            <button
                                                                className="btn btn-warning hover-focus"
                                                                onClick={() =>
                                                                    this.handleEditCustomFeature(
                                                                        feature
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa fa-fw fa-pencil-square-o"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-danger hover-focus"
                                                                onClick={() =>
                                                                    this.handleDeleteCustomFeature(
                                                                        feature
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa fa-fw fa-trash-o"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                            <div className="collapse" id="collapseTarget">
                                <EditCustomFeaturesForm
                                    data={this.state.edit_custom_feature}
                                    updateCustomFeature={
                                        this.updateCustomFeature
                                    }
                                    cancel={this.cancelEditCustomFeature}
                                />
                            </div>
                        </div>
                        <div className="col mt-3">
                            <CustomFeaturesForm
                                addCustomFeature={this.addCustomFeature}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-5 div-dark">
                    <h3>Options</h3>
                    <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 mt-2">
                        <div className="col mb-3">
                            <table className="table table-hover">
                                <TableHeader
                                    columns={this.option_columns}
                                    sortColumn={null}
                                />
                                <tbody>
                                    {this.state.current_options.map(
                                        (option, index) => (
                                            <tr key={"1-" + index}>
                                                <td>{option.option_name}</td>
                                                <td>
                                                    {option.values
                                                        .map(
                                                            (value) =>
                                                                value.value_name
                                                        )
                                                        .join(", ")}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    {this.state.data.options.map(
                                        (option, index) => (
                                            <tr key={"2-" + index}>
                                                <td>{option.option_name}</td>
                                                <td>
                                                    {option.values
                                                        .map(
                                                            (value) =>
                                                                value.value_name
                                                        )
                                                        .join(", ")}
                                                </td>
                                                {this.state.isNew && (
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() =>
                                                                this.handleDeleteOption(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <i className="fa fa-trash-o"></i>
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="col mb-3">
                            {this.state.isNew && (
                                <OptionForm addOption={this.addOption} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const ProductForm = (props) => {
    const { id } = useParams();
    const push = useNavigate();
    const replace = (path) => push(path, { replace: true });
    return <ProductFormBody {...{ ...props, id, push, replace }} />;
};

export default ProductForm;
