import { useState } from "react";
import "./Login.scss";

const Login = ({ passCheck, logErr, logLen }) => {
    const [password, setPassword] = useState("");

    const onPassChange = e => {
        setPassword(e.target.value);
    };

    return (
        <div className="log">
            <div className="log-wrap">
                <p>Control panel login.</p>
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" className="log-field" onChange={e => onPassChange(e)} placeholder="Enter password"></input>
                {logErr ? (
                    <>
                        <span className="log-err">Wrong password!!!</span>
                    </>
                ) : null}
                {logLen ? (
                    <>
                        <span className="log-err">Wrong password length!!!</span>
                    </>
                ) : null}
                <button onClick={() => passCheck(password)} className="log-btn" type="button">
                    Entry
                </button>
            </div>
        </div>
    );
};

export default Login;
