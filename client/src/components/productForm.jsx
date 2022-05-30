import React from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Joi from "joi-browser";
import Form from "./common/form";
import { getCategories, getSubCategories } from "../services/categoryService";
import { getProduct, saveProduct } from "../services/productService";
import { Collapse } from "bootstrap";
import OptionForm from "./optionForm";
import CustomFeaturesForm from "./customFeaturesForm";
import TableHeader from "./common/tableHeader";
import {
    deleteCustomFeature,
    saveCustomFeature,
    updateCustomFeature,
} from "../services/customFeatureService";
import EditCustomFeaturesForm from "./editCustomFeatureForm";

class ProductFormBody extends Form {
    state = {
        data: {
            product_id: 0,
            product_title: "",
            category_id: 0,
            sub_category_id: 0,
            sku: "",
            product_weight: 0,
            custom_features: [],
            options: [],
        },
        categories: [],
        subCategories: [],
        current_custom_features: [],
        current_options: [],
        isNew: false,
        edit_custom_feature: {},
        errors: {},
    };

    option_columns = [
        { path: "option_name", label: "Name" },
        { path: "values", label: "Values" },
    ];

    custom_features_columns = [
        { path: "custom_feature_name", label: "name" },
        { path: "custom_feature_val", label: "Value" },
        { key: "edit", label: "" },
    ];

    schema = {
        product_id: Joi.number(),
        product_title: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Product Title"),
        category_id: Joi.number().min(1).required().label("Category"),
        sub_category_id: Joi.number().min(1).required().label("Subcategory"),
        sku: Joi.string().required().min(5).max(20).label("SKU"),
        product_weight: Joi.number().required().min(1).label("Product Weight"),
        custom_features: Joi.array(),
        options: Joi.array(),
        isNew: Joi.bool(),
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
                return;
            }

            const { data } = await getProduct(productId);
            const current_custom_features = data.custom_features;
            const current_options = data.options;
            data.custom_features = [];
            data.options = [];
            this.setState({ data, current_custom_features, current_options });
        } catch (e) {
            if (e.response && e.response.status === 404)
                this.props.replace("/not-found");
        }
    }

    async populateSubCategories() {
        const { category_id } = this.state.data;
        let subCategories = [];
        if (category_id > 0) {
            const { data } = await getSubCategories(category_id);
            subCategories = data;
        }
        this.setState({ subCategories });
    }

    async componentDidMount() {
        await this.populateCategories();
        await this.populateProduct();
        await this.populateSubCategories();
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
                toast.error("An error occurred while saving the feature.");
                this.setState({ current_custom_features: originalFeatures });
            }
        }
    };

    handleCategoryChange = async ({ currentTarget: input }) => {
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        const category_id = input.value;
        const data = { ...this.state.data };
        data["category_id"] = category_id;

        let subCategories = [];
        if (category_id > 0) {
            const { data: sub } = await getSubCategories(category_id);
            subCategories = sub;
        }

        this.setState({ data, errors, subCategories });
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
                toast.error("An error occurred while deleting the feature.");
                this.setState({ current_custom_features: originalFeatures });
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
                toast.error("An error occurred while updating the feature.");
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

    doSubmit = async () => {
        const product = await saveProduct(this.state.data);
        this.props.push("/products");
    };

    render() {
        let categories = [];
        for (const category of this.state.categories) {
            categories.push({
                id: category.category_id,
                name: category.category_name,
            });
        }

        let subCategories = [];
        for (const category of this.state.subCategories) {
            subCategories.push({
                id: category.sub_category_id,
                name: category.sub_category_name,
            });
        }

        return (
            <div className="container">
                <h1>Product</h1>
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                    <div className="col mb-3">
                        <form onSubmit={this.handleSubmit}>
                            {this.renderInput("product_title", "Product Title")}
                            {this.renderSelect(
                                "category_id",
                                "Category",
                                [{ id: 0, value: "" }, ...categories],
                                this.handleCategoryChange
                            )}
                            {this.renderSelect(
                                "sub_category_id",
                                "Subcategory",
                                [{ id: 0, value: "" }, ...subCategories]
                            )}
                            {this.renderInput("sku", "SKU")}
                            {this.renderInput(
                                "product_weight",
                                "Product Weight",
                                "number"
                            )}
                            {this.renderButton("Save")}
                        </form>
                    </div>
                    <div className="col justify-content-center mb-3">
                        <div
                            className="card shadow text-center align-items-center hover-focus"
                            style={{ borderRadius: "5%" }}
                        >
                            <div>
                                <img
                                    src={
                                        "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4QWs8?ver=95ec&q=90&m=6&h=270&w=270&b=%23FFFFFFFF&f=jpg&o=f&aim=true"
                                    }
                                    className="card-img-top"
                                    alt=""
                                ></img>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
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
                                                        <i
                                                            className="fa fa-fw fa-pencil-square-o"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                this.handleEditCustomFeature(
                                                                    feature
                                                                )
                                                            }
                                                        ></i>
                                                        <i
                                                            className="ms-3 fa fa-fw fa-trash-o"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                this.handleDeleteCustomFeature(
                                                                    feature
                                                                )
                                                            }
                                                        ></i>
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
                                                        <i
                                                            className="fa fa-fw fa-pencil-square-o"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                this.handleEditCustomFeature(
                                                                    feature
                                                                )
                                                            }
                                                        ></i>
                                                        <i
                                                            className="ms-3 fa fa-fw fa-trash-o"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                this.handleDeleteCustomFeature(
                                                                    feature
                                                                )
                                                            }
                                                        ></i>
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
                <div className="mt-5">
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
