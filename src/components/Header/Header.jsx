import "./Header.scss";
import { useState } from "react";
import { HashLink } from "react-router-hash-link";
import { useLocation } from "react-router-dom";
import LogoHeart from "../../assets/header/logo_heart.png";
import LogoHeartReverse from "../../assets/header/logo_heart_reverse.png";
// dont delete below
import Faw from "../../assets/header/faw.jpg";
import ogImg from "../../assets/header/shop-socials.jpg";

const Header = () => {
    const [isShown, setIsShown] = useState(false);
    const { pathname } = useLocation();

    return (
        <header style={pathname == "/admin" ? { position: "absolute" } : { position: "fixed" }} className="header">
            <div className="container">
                <div className="header-logo" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
                    <HashLink smooth to="/#top">
                        <span className="logo-58">
                            <span className="logo-5">5</span>8
                        </span>{" "}
                        Dresses
                        {isShown ? <img src={LogoHeartReverse} /> : <img src={LogoHeart} />}
                    </HashLink>
                </div>
                <nav className="header-side">
                    <HashLink smooth to="/#products">
                        Products
                    </HashLink>
                    <HashLink smooth to="/#adress" className="btn-wsup">
                        Adress
                    </HashLink>
                </nav>
            </div>
        </header>
    );
};

export default Header;
