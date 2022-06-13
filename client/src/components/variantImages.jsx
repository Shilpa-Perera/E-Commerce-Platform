import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVariantById } from "../services/variantService";
import { variantImageUrl } from "../services/imageService";
import Carousel from "./common/carousel";

class VariantImagesBody extends React.Component {
    state = {
        variant: null,
        images: []
    }

    async componentDidMount() {
        const { id: variantId, replace } = this.props;

        try {
            const { data: variant } = await getVariantById(variantId);

            const images = [];
            if (variant.images.length > 0)
                for (const { image_name } of variant.images) {
                    images.push(variantImageUrl(image_name));
                }

            this.setState({ variant, images })
        } catch (e) {
            if (e.response && e.response.status === 404)
                replace("/not-found");
        }
    }

    render() {
        const { variant, images } = this.state;

        if (variant === null) return;

        const { variant_name } = variant;

        return (
            <div className="container mb-5">
                <h1>{variant_name}</h1>
                <h2 className="mt-4 mb-5">Manage variant images</h2>
                <div className="container-fluid">
                    <div className="row row-cols-1 row-cols-sm-1 row-cols-lg-2">
                        {images.length > 0 && <div className="col mb-3 p-5">
                            <div
                                className="card shadow hover-focus p-3"
                                style={{ borderRadius: "3%" }}
                            >
                                <Carousel
                                    images={images}
                                    id={`product-carousel`}
                                />
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}

function VariantImages(props) {
    const { id } = useParams();
    const push = useNavigate();
    const replace = (path) => push(path, { replace: true });
    return <VariantImagesBody { ...{ ...props, id, push, replace } } />
}

export default VariantImages;
