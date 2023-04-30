import "./Footer.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import shop1 from "../../assets/footer/shop-1.jpeg";
import shop1Webp from "../../assets/footer/shop-1.webp";
import shop2 from "../../assets/footer/shop-2.jpeg";
import shop2Webp from "../../assets/footer/shop-2.webp";
import shop3 from "../../assets/footer/shop-3.jpeg";
import shop3Webp from "../../assets/footer/shop-3.webp";
import shop4 from "../../assets/footer/shop-4.jpeg";
import shop4Webp from "../../assets/footer/shop-4.webp";

const Footer = () => {
    return (
        <footer id="adress" className="footer">
            <div className="container">
                <h2 className="h2">How to find our store?</h2>
                <div className="footer__images">
                    <picture>
                        <source srcSet={shop1Webp} type="image/webp" />
                        <LazyLoadImage src={shop1} alt="58platev v gostinom dvore" />
                    </picture>
                    <picture>
                        <source srcSet={shop2Webp} type="image/webp" />
                        <LazyLoadImage src={shop2} alt="58platev v gostinom dvore" />
                    </picture>
                    <picture>
                        <source srcSet={shop3Webp} type="image/webp" />
                        <LazyLoadImage src={shop3} alt="58platev v gostinom dvore" />
                    </picture>
                    <picture>
                        <source srcSet={shop4Webp} type="image/webp" />
                        <LazyLoadImage src={shop4} alt="58platev na tretiem etaze" />
                    </picture>
                </div>
                <p>123 Sand Street, City of Dreams, USA.</p>
            </div>
        </footer>
    );
};

export default Footer;
