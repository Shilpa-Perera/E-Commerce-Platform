import React from "react";
import CarouselImage from "./carouselImage";

function Carousel({ id, images, defaultImage }) {
    return (
        <div>
            <div
                id={id}
                className="carousel carousel-dark slide"
                data-bs-ride="carousel"
            >
                <div className="carousel-indicators">
                    {images.map((image, index) => (
                        <button
                            type="button"
                            data-bs-target={`#${id}`}
                            data-bs-slide-to={index}
                            aria-current={index === 0}
                            aria-label={`Slide ${index}`}
                            className={index === 0 ? "active" : ""}
                            key={index}
                        ></button>
                    ))}
                </div>
                <div className="carousel-inner">
                    {images.map((image, index) => (
                        <div
                            className={
                                index === 0
                                    ? "carousel-item active"
                                    : "carousel-item"
                            }
                            key={index}
                        >
                            <CarouselImage
                                img={image}
                                defaultImg={defaultImage}
                            />
                        </div>
                    ))}
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target={`#${id}`}
                    data-bs-slide="prev"
                >
                    <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target={`#${id}`}
                    data-bs-slide="next"
                >
                    <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default Carousel;
