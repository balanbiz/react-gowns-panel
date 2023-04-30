import "./ProdGallery.scss";
import { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import GalleryArrow from "../../../assets/misc/GalleryArrow";

const ProdGallery = ({
    galleryProps: {
        params: { imagesArrLength, currentPosition },
        images,
        firstImg,
        changeActiveSlide,
        calcParams,
        checkForDeadEnd,
        onGalleryArrow,
    },
    modalStatus,
}) => {
    const styleDisplay = imagesArrLength >= 5 ? { display: "block" } : { display: "none" };
    const styleJustify = imagesArrLength < 4 ? "center" : "start";
    const styleTransform = styleJustify == "start" && `translateX(${currentPosition}px)`;

    useEffect(() => {
        checkForDeadEnd();
    }, [currentPosition]);

    return (
        <div className="prodGallery">
            {console.log("prodGallery render")}
            <div className="prodGallery-controls">
                <div style={styleDisplay} onClick={() => onGalleryArrow("backward")} className="prodGallery-controls__arrowLeft">
                    <GalleryArrow />
                </div>
                <div style={styleDisplay} onClick={() => onGalleryArrow("forward")} className="prodGallery-controls__arrowRight">
                    <GalleryArrow />
                </div>
            </div>
            <div className="prodGallery-overflow">
                <div
                    style={{
                        justifyContent: styleJustify,
                        transform: styleTransform,
                    }}
                    className="prodGallery-images"
                >
                    {images.map((image, key) => {
                        const altImage = image.nowebp.replace(/^.*[\\\/]/, "");
                        return (
                            <picture key={key}>
                                <source srcSet={image.webp} type="image/webp" />
                                <LazyLoadImage
                                    visibleByDefault={modalStatus ? true : false}
                                    afterLoad={calcParams}
                                    src={image.nowebp}
                                    alt={altImage}
                                    style={firstImg == image ? { border: "2px solid #ff4656" } : null}
                                    onClick={() => changeActiveSlide(image)}
                                />
                            </picture>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProdGallery;
