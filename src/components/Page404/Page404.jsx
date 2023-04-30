import "./Page404.scss";
import { Link } from "react-router-dom";

const Page404 = () => {
    return (
        <>
            <section className="page404">
                <div className="container">
                    <div>
                        This page does not exist. Please return to <Link to={"/"}> main </Link>.
                    </div>
                </div>
            </section>
        </>
    );
};

export default Page404;
