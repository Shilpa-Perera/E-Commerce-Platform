import React, { useState } from "react";

function CarouselImage({ img, defaultImg }) {
    const [image, setImage] = useState(`${img}`);
    const [error, setError] = useState(false);

    return (
        <img
            src={image}
            className="d-block w-100"
            alt="..."
            style={{ maxHeight: "75vh" }}
            onError={() => {
                if (!error) {
                    setImage(defaultImg);
                    setError(true);
                }
            }}
        />
    );
}

export default CarouselImage;
