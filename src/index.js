import "./index.scss";
import React, { Suspense } from "react";
import ReactDOMClient from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "./components/App";
import Layout from "./components/Layout/Layout";
import LoadingSvg from "./assets/misc/loadingSvg.jsx";
const Admin = React.lazy(() => import("./components/Admin/Admin"));
const Page404 = React.lazy(() => import("./components/Page404/Page404"));
const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
const svgStyle = {
    width: "200px",
    height: "200px",
    display: "block",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
};

root.render(
    <React.StrictMode>
        <Suspense fallback={<LoadingSvg style={svgStyle} />}>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<App />} />
                        <Route path="*" element={<Page404 />} />
                    </Route>
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Router>
        </Suspense>
    </React.StrictMode>
);
