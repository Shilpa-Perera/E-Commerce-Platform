import React, { Component } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";
import { Collapse } from "bootstrap";
import { getProduct, updateDefault } from "../services/productService";
import { getVariant, updateVariant } from "../services/variantService";
import AddedVariantsTable from "./addedVariantsTable";
import EditVariantForm from "./editVariantForm";

class VariantFormBody extends Component {
    state = {
        product: null,
        availableVariants: null,
        addedVariants: null,
        addedSortColumn: { path: "variant_name", order: "asc" },
        editVariant: null,
    };

    handleEdit = (editVariant) => {
        this.setState({ editVariant });
        const collapse = document.getElementById("collapseTarget");
        const bsCollapse = new Collapse(collapse, { toggle: false });
        bsCollapse.show();
    };

    updateVariant = async (variant) => {
        this.hideCollapse();
        const { editVariant } = this.state;
        const { index, variant_id, isDefault, options } = editVariant;

        variant.variant_id = variant_id;
        variant.isDefault = isDefault;
        variant.index = index;
        variant.options = options;

        const addedVariants = [...this.state.addedVariants];
        const originalAddedVariants = [...addedVariants];

        addedVariants[index] = variant;

        this.setState({ editVariant: null, addedVariants });

        try {
            await updateVariant(variant);
        } catch (e) {
            if (e.response && e.response.status === 404)
                toast.error("This variant was not found on the server.");

            this.setState({ addedVariants: originalAddedVariants });
        }
    };

    cancelEditVariant = () => {
        this.hideCollapse();
        this.setState({ editVariant: null });
    };

    hideCollapse() {
        const collapse = document.getElementById("collapseTarget");
        const bsCollapse = new Collapse(collapse, { toggle: false });
        bsCollapse.hide();
    }

    handleMakeDefault = async (variant) => {
        variant = { ...variant };
        const product = { ...this.state.product };
        const originalProduct = { ...product };
        const addedVariants = [...this.state.addedVariants];
        const originalAddedVariants = [...addedVariants];

        for (let i = 0; i < addedVariants.length; ++i) {
            if (addedVariants[i].isDefault) {
                addedVariants[i].isDefault = false;
                break;
            }
        }

        product.default_variant_id = variant.variant_id;
        variant.isDefault = true;
        addedVariants[variant.index] = variant;

        this.setState({ addedVariants, product });

        try {
            await updateDefault(product.product_id, variant.variant_id);
        } catch (e) {
            toast.error("An error has occurred");
            this.setState({
                product: originalProduct,
                addedVariants: originalAddedVariants,
            });
        }
    };

    handleAddedVariantsSort = (addedSortColumn) => {
        if (addedSortColumn.path) this.setState({ addedSortColumn });
    };

    getAddedVariants = () => {
        const { addedVariants, addedSortColumn } = this.state;
        return _.orderBy(
            addedVariants,
            (variant) => {
                if (addedSortColumn.path === "price") {
                    return +variant.price;
                }
                return variant[addedSortColumn.path];
            },
            [addedSortColumn.order]
        );
    };

    async componentDidMount() {
        const { id: product_id } = this.props;
        const { data: product } = await getProduct(product_id);

        let availableVariants = [];
        const addedVariants = [];

        for (const option of product.options) {
            const { option_id, option_name } = option;
            const values = [...option.values];
            if (availableVariants.length > 0) {
                const newAvailableVariants = [];
                for (const value of values) {
                    const { value_id, value_name } = value;
                    for (let i = 0; i < availableVariants.length; ++i) {
                        const variant = [...availableVariants[i]];
                        variant.push({
                            option_id,
                            option_name,
                            value_id,
                            value_name,
                        });
                        newAvailableVariants.push(variant);
                    }
                }
                availableVariants = newAvailableVariants;
            } else {
                for (const value of values) {
                    const { value_id, value_name } = value;
                    const variant = [
                        { option_id, option_name, value_id, value_name },
                    ];
                    availableVariants.push(variant);
                }
            }
        }

        const newAvailableVariants = [...availableVariants];
        let index = 0;
        for (let i = 0; i < availableVariants.length; ++i) {
            const options = availableVariants[i];
            try {
                let { data: variant } = await getVariant(product_id, options);
                variant.options = options;
                variant.isDefault =
                    variant.variant_id === product.default_variant_id;
                variant.index = index;
                addedVariants.push(variant);
                newAvailableVariants[i] = null;
                ++index;
            } catch (e) {}
        }

        availableVariants = [];
        for (const variant of newAvailableVariants)
            if (variant !== null) availableVariants.push(variant);

        this.setState({ product, availableVariants, addedVariants });
    }

    render() {
        const { product, availableVariants, addedSortColumn, editVariant } =
            this.state;
        const addedVariants = this.getAddedVariants();

        const addedVariantsClasses =
            editVariant === null
                ? "row row-cols-1"
                : "row row-cols-1 row-cols-sm-1 row-cols-lg-2";
        const addedVariantsTableClasses =
            editVariant === null ? "col mb-3 p-5" : "col mb-3 p-5 col-lg-8";

        if (product) {
            const { editVariant } = this.state;
            return (
                <div className="container">
                    <h1>{product.product_title}</h1>
                    <h2 className="text-muted mt-4">Manage variants</h2>
                    <div className="container-fluid">
                        <div className={addedVariantsClasses}>
                            <div className={addedVariantsTableClasses}>
                                <AddedVariantsTable
                                    options={addedVariants}
                                    onEdit={this.handleEdit}
                                    onMakeDefault={this.handleMakeDefault}
                                    sortColumn={addedSortColumn}
                                    onSort={this.handleAddedVariantsSort}
                                />
                            </div>
                            <div
                                className="collapse col col-lg-4 mb-3 p-5"
                                id="collapseTarget"
                            >
                                {editVariant && (
                                    <EditVariantForm
                                        options={editVariant.options}
                                        updateVariant={this.updateVariant}
                                        cancel={this.cancelEditVariant}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    }
}

function VariantForm(props) {
    const { id } = useParams();
    const push = useNavigate();
    const replace = (path) => push(path, { replace: true });
    return <VariantFormBody {...{ ...props, id, push, replace }} />;
}

export default VariantForm;
