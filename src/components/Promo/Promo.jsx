import "./Promo.scss";
import Video from "../../assets/promo/promo.mp4";

const Promo = () => {
    return (
        <section className="promo">
            <video src={Video} muted loop autoPlay playsInline />
            <div className="container">
                <div className="promo-wrap">
                    <h1>Dress shop in the city of Dreams</h1>
                    <p className="promo-descr">
                        An inexpensive women's clothing store in the center of Dreams. Women's dresses, suits, blouses, sundresses, etc. By affordable price.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Promo;
