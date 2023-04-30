import "./ProdModal.scss";
import ProdGallery from "../ProdGallery/ProdGallery";
import { useEffect } from "react";

function getScrollBarWidth() {
    const el = document.createElement("div");
    el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
    document.body.appendChild(el);
    const width = el.offsetWidth - el.clientWidth;
    el.remove();
    return width;
}

function support_format_webp() {
    var elem = document.createElement("canvas");

    if (!!(elem.getContext && elem.getContext("2d"))) {
        // was able or not to get WebP representation
        return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
    } else {
        // very old browser like IE 8, canvas not supported
        return false;
    }
}

const ProdModal = ({ galleryProps, galleryProps: { firstImg }, toggleProdModal, changeFirstImg, altFirstImg, modalStatus }) => {
    const img = new Image();
    const getCLientHeight = document.body.clientHeight;
    let imgWidth = 0;
    let imgHeight = 0;
    if (support_format_webp()) {
        img.src = firstImg.webp;
    } else {
        img.src = firstImg.nowebp;
    }

    imgWidth = img.naturalWidth * (getCLientHeight / img.naturalHeight / 1.6);
    imgHeight = img.naturalHeight * (getCLientHeight / img.naturalHeight / 1.6);

    useEffect(() => {
        document.querySelector(".header").style.paddingRight = `${getScrollBarWidth()}px`;
        document.body.style.overflow = "hidden";
        document.body.style.marginRight = `${getScrollBarWidth()}px`;
        pressEscListener("add");
        return () => {
            document.body.style.overflow = "auto";
            document.body.style.marginRight = `0px`;
            document.querySelector(".header").style.paddingRight = `0`;
            pressEscListener("remove");
        };
    }, []);

    const pressEscListener = addOrRemove => {
        const listen = document.addEventListener("keydown", e => {
            if (e.key === "Escape" || e.key === "Esc") {
                toggleProdModal();
            }
        });

        if (addOrRemove == "add") {
            listen;
        } else if (addOrRemove == "remove") {
            document.removeEventListener("keydown", listen);
        }
    };

    return (
        <div className="prodModal">
            {console.log("prodModal render")}
            <div onClick={() => changeFirstImg("backward")} className="prodModal__half-left"></div>
            <div onClick={() => changeFirstImg("forward")} className="prodModal__half-right"></div>
            <svg
                className="prodModal-svg"
                onClick={() => toggleProdModal()}
                width="60"
                height="60"
                viewBox="0 0 48 48"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect width="65" height="65" fill="#ff4656" fillOpacity="1" />
                <path d="M14 14L34 34" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 34L34 14" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="prodModal__wrap">
                <div onClick={() => changeFirstImg("forward")} className="prodModal-img-wrap" style={{ width: imgWidth, height: imgHeight }}>
                    <picture>
                        <source srcSet={firstImg.webp} type="image/webp" />
                        <img src={firstImg.nowebp} alt={altFirstImg} className="prodModal-img" />
                    </picture>
                    <div
                        className="prodModal-img-wrap-back"
                        style={{
                            backgroundImage: support_format_webp() ? `url("${firstImg.webp}")` : `url("${firstImg.nowebp}")`,
                        }}
                    ></div>
                </div>
                {<ProdGallery galleryProps={galleryProps} modalStatus={modalStatus} />}
            </div>
        </div>
    );
};

export default ProdModal;
