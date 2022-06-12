import React from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

class ProductImage extends React.Component {
    state = {
        selectedImage: null,
        selectedImageUrl: "",
        croppedImage: null,
        croppedImageUrl: "",
        hasCropped: false,
        pixelCrop: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
    };

    render() {
        const {
            selectedImage,
            selectedImageUrl,
            croppedImageUrl,
            crop,
            zoom,
            hasCropped,
        } = this.state;
        return (
            <div>
                {selectedImage !== null ? (
                    <div>
                        {hasCropped ? (
                            <div className="d-flex justify-content-center mb-3">
                                <img
                                    alt="not fount"
                                    width={"250px"}
                                    src={croppedImageUrl}
                                />
                            </div>
                        ) : (
                            <div className="mb-4 div-dark">
                                <h4 className="text-warning mb-4">
                                    Crop Image
                                </h4>
                                <div className="cropper mb-3 div-dark">
                                    <Cropper
                                        image={selectedImageUrl}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={(crop) =>
                                            this.setState({ crop })
                                        }
                                        onCropComplete={(
                                            croppedArea,
                                            croppedAreaPixels
                                        ) => {
                                            this.setState({
                                                pixelCrop: croppedAreaPixels,
                                            });
                                        }}
                                        onZoomChange={(zoom) =>
                                            this.setState({ zoom })
                                        }
                                    />
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button
                                        className="btn btn-success"
                                        onClick={async () => {
                                            const {
                                                selectedImageUrl,
                                                pixelCrop,
                                            } = this.state;
                                            const [
                                                croppedImage,
                                                croppedImageUrl,
                                            ] = await getCroppedImg(
                                                selectedImageUrl,
                                                pixelCrop
                                            );
                                            this.setState({
                                                croppedImage,
                                                croppedImageUrl,
                                                hasCropped: true,
                                            });
                                        }}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    this.setState({
                                        selectedImage: null,
                                        selectedImageUrl: "",
                                        croppedImage: null,
                                        croppedImageUrl: "",
                                        hasCropped: false,
                                    });
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="div-dark">
                        <h4 className="text-warning mb-4">
                            Select an image to upload
                        </h4>
                        <input
                            className="form-control"
                            type="file"
                            accept="image/jpeg,image/png"
                            name="product-title-image"
                            onChange={(event) => {
                                const selectedImage = event.target.files[0];
                                const selectedImageUrl = URL.createObjectURL(
                                    event.target.files[0]
                                );
                                this.setState({
                                    selectedImage,
                                    selectedImageUrl,
                                });
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default ProductImage;
