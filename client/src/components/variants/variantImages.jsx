import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getVariantById,
    postVariantImage,
} from "../../services/variantService";
import { variantImageUrl } from "../../services/imageService";
import Carousel from "../common/carousel";
import AddImage from "../addImage";
import { toast } from "react-toastify";
import { checkProductVariant, getProduct } from "../../services/productService";

class VariantImagesBody extends React.Component {
    state = {
        product: null,
        variant: null,
        images: [],
    };

    async componentDidMount() {
        const { productId, variantId, replace } = this.props;

        const { data } = await checkProductVariant(productId, variantId);
        if (!data.success) replace("/not-found");

        try {
            const { data: product } = await getProduct(productId);
            const { data: variant } = await getVariantById(variantId);

            const images = [];
            if (variant.images.length > 0)
                for (const { image_name } of variant.images) {
                    images.push(variantImageUrl(image_name));
                }

            this.setState({ product, variant, images });
        } catch (e) {
            if (e.response && e.response.status === 404) replace("/not-found");
        }
    }

    handleSaveImage = async (newImageUrl, newImage) => {
        const originalImages = [...this.state.images];
        const originalVariant = { ...this.state.variant };
        const { variant_id } = this.state.variant;
        try {
            let images = [...originalImages];
            images.push(newImageUrl);
            this.setState({
                images,
            });

            const { data: file } = await postVariantImage(variant_id, newImage);
            const { filename } = file;

            images = [...originalImages];
            images.push(variantImageUrl(filename));

            const variant = { ...originalVariant };
            variant.images.push(filename);

            this.setState({ variant, images });
        } catch (e) {
            console.error(e);
            toast.error("Could not upload image", { theme: "dark" });
            this.setState({ variant: originalVariant, images: originalImages });
        }
    };

    render() {
        const { product, variant, images } = this.state;

        if (variant === null) return;

        const { product_title } = product;
        const { variant_name } = variant;

        return (
            <div className="container mb-5">
                <h1>{product_title}</h1>
                <h2>{variant_name}</h2>
                <h3 className="mt-4 mb-5">Manage variant images</h3>
                <div className="container-fluid">
                    <div className="row row-cols-1 row-cols-sm-1 row-cols-lg-2 div-dark">
                        <div className="col mb-3 p-5">
                            <h4 className="text-success mb-4">Images</h4>
                            {images.length > 0 && (
                                <div
                                    className="card shadow hover-focus p-3"
                                    style={{ borderRadius: "3%" }}
                                >
                                    <Carousel
                                        images={images}
                                        id={`product-carousel`}
                                    />
                                </div>
                            )}
                            {images.length === 0 && (
                                <div className="alert alert-warning">
                                    <i className="fa fa-warning"></i>
                                    <span className="ms-2">
                                        No images have been added. Please Add
                                        images.
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="col mb-3 p-5">
                            <AddImage
                                saveImage={this.handleSaveImage}
                                removeImage={() => {}}
                                aspectRatio={4 / 3}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function VariantImages(props) {
    const { id: productId, v_id: variantId } = useParams();
    const push = useNavigate();
    const replace = (path) => push(path, { replace: true });
    return (
        <VariantImagesBody
            {...{ ...props, productId, variantId, push, replace }}
        />
    );
}

export default VariantImages;
