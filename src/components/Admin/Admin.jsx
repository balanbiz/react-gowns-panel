import { useState, useEffect } from "react";
import Fetching from "../../server/Fetching";
import "./Admin.scss";
import Login from "./Login/Login";
import Panel from "./Panel/Panel";
import Header from "../Header/Header";
import App from "../App";
import Footer from "../Footer/Footer";

const Admin = () => {
    const fetching = new Fetching();

    const [adminState, setAdminState] = useState({
        auth: false,
    });
    const [logErr, setLogErr] = useState(false);
    const [logLen, setLogLen] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (adminState.auth) {
            setLogErr(false);
        }
    }, [adminState]);

    const checkAuth = async () => {
        await fetching.getResourse("./api/checkAuth.php").then(res => {
            setAdminState({
                auth: res.auth,
            });
        });
    };

    const passCheck = async pass => {
        if (pass.length > 7) {
            await fetching.postResourse("./api/login.php", { password: pass });
            await checkAuth();
            if (!adminState.auth) {
                setLogErr(true);
            }
            setLogLen(false);
        } else {
            setLogLen(true);
        }
    };

    return (
        <>
            {console.log("admin render")}
            {adminState.auth ? (
                <>
                    <Panel checkAuth={checkAuth} />
                    <Header />
                    <App />
                    <Footer />
                </>
            ) : (
                <>
                    <Login passCheck={passCheck} logErr={logErr} logLen={logLen} />
                </>
            )}
        </>
    );
};

export default Admin;
