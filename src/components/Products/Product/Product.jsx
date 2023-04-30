import "./product.scss";
import { useState, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ProdGallery from "../ProdGallery/ProdGallery";
import ProdModal from "../ProdModal/ProdModal";
import LogoHeart from "../../../assets/header/logo_heart.png";
import LogoHeartReverse from "../../../assets/header/logo_heart_reverse.png";

function memoPropsCompare(prevProps, nextProps) {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

const Product = memo(({ imageFolder, images, price, likes, id, name, related, onLike, deleteProduct, editProductClick }) => {
    let [boldColours, setBoldColours] = useState([]);
    let [boldSizes, setBoldSizes] = useState([]);
    let [storageLike, setStorageLike] = useState(localStorage[`liked${id}`] == "yes");
    let [modalStatus, setModalStatus] = useState(false);
    let [firstImg, setFirstImg] = useState(images[0]);

    let likedStyle = storageLike ? { color: "#fff" } : { color: "#000" };
    const { pathname } = useLocation();
    const altFirstImg = firstImg.nowebp.replace(/^.*[\\\/]/, "");
    // const nameIndex = firstImg.lastIndexOf(altFirstImg)
    const colours = Object.keys(related);
    const allSizes = [];

    useEffect(() => {
        setFirstImg(images[0]);
    }, [images]);

    Object.values(related).forEach(array => {
        allSizes.push(...array);
    });
    const allSizesNoSame = [...new Set(allSizes)].sort();

    // onColour and onSize have logic depending on types and strict comparison operators.
    const onColour = colour => {
        const neededSizes = related[colour];

        if (boldColours !== colour) {
            // boldSizes is an array
            setBoldSizes(neededSizes);
            // boldColours is a string solo value!
            setBoldColours(colour);
        } else {
            setBoldSizes([]);
            setBoldColours([]);
        }
    };

    const onSize = size => {
        let neededColours = [];

        for (let key in related) {
            if (related[key].includes(size)) {
                neededColours.push(key);
            }
        }
        if (size == boldSizes && neededColours.length == 1) {
            setBoldSizes([]);
            setBoldColours([]);
        } else if (size !== boldSizes) {
            // boldColours is array now!
            setBoldColours(neededColours);
            // if size solo and string its !== boldSizes solo arr value.
            setBoldSizes(size);
        } else {
            setBoldSizes([]);
            setBoldColours([]);
        }
    };

    const onLikeClick = () => {
        setStorageLike(storageLike => !storageLike);
    };

    const getLikesNumber = () => {
        if (likes == 0) {
            return 20;
        } else if (likes > 0 && likes < 10) {
            return 21;
        } else if (likes >= 10 && likes < 100) {
            return 17;
        } else if (likes >= 100 && likes < 1000) {
            return 13;
        }
    };

    // ProdModal functions

    const toggleProdModal = () => {
        if (!modalStatus) {
            setModalStatus({ modalStatus });
        } else {
            document.querySelector(".prodModal").classList.add("prodModal_close");
            setTimeout(() => {
                setModalStatus(!modalStatus);
            }, 300);
        }
    };

    const changeFirstImg = direction => {
        const index = images.indexOf(firstImg);
        // document.querySelector('.prodModal-img_show').classList.remove('prodModal-img_show')
        // console.log(images, images.indexOf(firstImg) + 1, quantityRenderItems)

        if (direction === "forward") {
            SyncFirstImgAndGallery("forward");
            if (images.length - 2 < index) {
                setFirstImg(images[0]);
            } else {
                setFirstImg(images[index + 1]);
            }
        } else if (direction === "backward") {
            if (index === 0) {
                setFirstImg(images[images.length - 1]);
            } else {
                setFirstImg(images[index - 1]);
            }
            SyncFirstImgAndGallery("backward");
        }
    };

    // ProdGallery functions, state

    let [params, setParams] = useState({ currentPosition: 0 });
    let [currentShift, setCurrentShift] = useState(0);
    let { allItemsWidth, itemWidth, imagesArrLength, quantityRenderItems, renderedItemsWidth, currentPosition } = params;

    function moveGallery(direction) {
        if (direction == "forward") {
            setCurrentShift((currentShift += 1));
            setParams({
                ...params,
                currentPosition: (currentPosition -= itemWidth),
            });
        } else if (direction == "backward") {
            setCurrentShift((currentShift -= 1));
            setParams({
                ...params,
                currentPosition: (currentPosition += itemWidth),
            });
        }
    }

    const calcParams = () => {
        const itemWidth = document.querySelector(".prodGallery-images picture > img").offsetWidth + 4;
        const imagesArrLength = images.length;
        const allItemsWidth = itemWidth * imagesArrLength;
        const quantityRenderItems = 4;
        const renderedItemsWidth = itemWidth * quantityRenderItems;

        setParams({
            imagesArrLength,
            allItemsWidth,
            itemWidth,
            quantityRenderItems,
            renderedItemsWidth,
            currentPosition,
        });
    };

    function SyncFirstImgAndGallery(direction) {
        if (direction === "forward") {
            if (images.indexOf(firstImg) + 1 == quantityRenderItems + currentShift) {
                moveGallery("forward");
            }
        } else if (direction === "backward") {
            if (images.indexOf(firstImg) == currentShift) {
                moveGallery("backward");
            }
        }
    }

    const onGalleryArrow = direction => {
        if (direction == "forward") {
            moveGallery("forward");
        } else if (direction == "backward") {
            moveGallery("backward");
        }
    };

    const checkForDeadEnd = () => {
        if (currentPosition > 0) {
            let endTransformValue = -itemWidth * (imagesArrLength - quantityRenderItems);

            setParams({
                ...params,
                currentPosition: endTransformValue,
            });
            setCurrentShift(imagesArrLength - quantityRenderItems);
        }

        if (allItemsWidth + currentPosition == renderedItemsWidth - itemWidth) {
            setParams({
                ...params,
                currentPosition: 0,
            });
            setCurrentShift(0);
        }
    };

    const changeActiveSlide = imageName => {
        const index = images.indexOf(imageName);
        setFirstImg(images[index]);
    };

    const galleryProps = {
        params: params,
        calcParams: calcParams,
        images: images,
        firstImg: firstImg,
        checkForDeadEnd: checkForDeadEnd,
        onGalleryArrow: onGalleryArrow,
        changeActiveSlide: changeActiveSlide,
    };

    return (
        <li className="prod-card__edit">
            {console.log("ProductRender ", id)}
            {modalStatus && (
                <ProdModal
                    galleryProps={galleryProps}
                    toggleProdModal={toggleProdModal}
                    changeFirstImg={changeFirstImg}
                    altFirstImg={altFirstImg}
                    modalStatus={modalStatus}
                    key={id}
                />
            )}
            {pathname === "/admin" ? (
                <div className="prod-card__edit-menu">
                    <p>
                        Product №<span style={{ fontWeight: "bold", fontSize: "18px" }}>{`${id}`}</span>, Folder №
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>{`${imageFolder}`}</span>
                    </p>
                    <button onClick={() => editProductClick(id)} type="button">
                        Edit product
                    </button>
                    <button onClick={() => deleteProduct(id, imageFolder)} type="button">
                        Delete product
                    </button>
                </div>
            ) : null}
            <div className="prod-card" style={storageLike ? { border: "3px solid #ff4656" } : { border: "0px solid #fff" }}>
                <div className="prod-card__name">{name}</div>
                <picture onClick={() => toggleProdModal()} className="prod-card__img">
                    <source srcSet={firstImg.webp} type="image/webp" />
                    <LazyLoadImage src={firstImg.nowebp} alt={altFirstImg} />
                </picture>
                {images.length >= 2 && <ProdGallery galleryProps={galleryProps} />}
                <div className="prod-card__line">
                    <div
                        className="prod-card__like-wrap"
                        onClick={() => {
                            onLike(id);
                            onLikeClick();
                        }}
                    >
                        <img className="prod-card__line-like" src={storageLike ? LogoHeart : LogoHeartReverse} alt="like heart" />
                        <div
                            className="prod-card__line-like-lay"
                            style={{
                                backgroundImage: storageLike ? `url(${LogoHeart})` : `url(${LogoHeartReverse})`,
                            }}
                        ></div>
                        <span
                            style={{
                                left: getLikesNumber() + "px",
                                ...likedStyle,
                            }}
                            className="prod-card__line-likes"
                        >
                            {likes}
                        </span>
                    </div>
                    <p className="prod-card__line-price">
                        {price} <span>₽</span>
                    </p>
                </div>
                <ul className="prod-card__colours">
                    {colours.map((colour, key) => {
                        if (colour != "default") {
                            if (boldColours.includes(colour)) {
                                return (
                                    <li className="prod-card_bold" onClick={() => onColour(colour)} key={key}>
                                        {colour}
                                    </li>
                                );
                            } else if (boldColours.length == 0 && boldSizes.length == 0) {
                                return (
                                    <li onClick={() => onColour(colour)} key={key}>
                                        {colour}
                                    </li>
                                );
                            } else {
                                return (
                                    <li className="prod-card_vague" onClick={() => onColour(colour)} key={key}>
                                        {colour}
                                    </li>
                                );
                            }
                        }
                    })}
                </ul>
                {
                    <ul className="prod-card__sizes">
                        {allSizesNoSame.map((size, key) => {
                            if (boldSizes.includes(size)) {
                                return (
                                    <li className="prod-card_bold" onClick={() => onSize(size)} key={key}>
                                        {size}
                                    </li>
                                );
                            } else if (boldColours.length == 0 && boldSizes.length == 0) {
                                return (
                                    <li onClick={() => onSize(size)} key={key}>
                                        {size}
                                    </li>
                                );
                            } else {
                                return (
                                    <li className="prod-card_vague" onClick={() => onSize(size)} key={key}>
                                        {size}
                                    </li>
                                );
                            }
                        })}
                    </ul>
                }
            </div>
        </li>
    );
}, memoPropsCompare);

export default Product;
