import { lazy } from "react";
import Products from "./Products/Products";
import ErrorBoundary from "./Error/Error";
const Promo = lazy(() => import("./Promo/Promo"));

export const App = () => {
    return (
        <>
            <Promo />
            <ErrorBoundary>
                <Products />
            </ErrorBoundary>
        </>
    );
};

export default App;
