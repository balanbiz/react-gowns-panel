import "./Panel.scss";
import Fetching from "../../../server/Fetching";

const Panel = ({ checkAuth }) => {
    const fetching = new Fetching();

    const logout = async () => {
        await fetching.getResourse("./api/logout.php");
        checkAuth();
    };

    return (
        <section className="pnl">
            <button onClick={logout} className="pnl-out" type="button">
                Exit
            </button>
        </section>
    );
};

export default Panel;
