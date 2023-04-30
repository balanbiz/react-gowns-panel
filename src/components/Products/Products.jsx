import "./Products.scss";
import { useState, useEffect, useRef, lazy } from "react";
import { useLocation } from "react-router-dom";
import Product from "./Product/Product";
import Fetching from "../../server/Fetching";
import LoadingSvg from "../../assets/misc/loadingSvg";

const AddProd = lazy(() => import("../Admin/AddProd/AddProd"));

const Products = () => {
    const [products, setProducts] = useState([]);
    const [editId, setEditId] = useState("");
    const [page, setPage] = useState({
        interval: 12,
        prevIntervals: 0,
        deleted: 0,
    });
    const [displayLoadBtn, setDisplayLoadBtn] = useState(true);
    const [loading, setLoading] = useState(false);
    const fetching = new Fetching();
    const { pathname } = useLocation();
    const editRef = useRef();
    const defaulinterval = 12;

    useEffect(() => {
        const fetchData = async () =>
            await fetching.postResourse("./api/loadMore.php", page).then(res => {
                if (res.length === undefined) {
                    setProducts([res]);
                } else {
                    setProducts(res);
                }
            });
        fetchData();
    }, []);

    pathname === "/admin" &&
        useEffect(() => {
            const waitAddProd = async () => await editRef.current.editProduct();
            waitAddProd();
        }, [editId]);

    const onLike = async id => {
        let prodWithId = products.filter(prod => prod.id == id);
        let likePlus = Number(prodWithId[0].likes) + 1;
        let likeMinus = Number(prodWithId[0].likes) - 1;
        const updLike = operatorVar => ({
            ...prodWithId[0],
            likes: operatorVar,
        });
        const sameSetProduct = operatorVar =>
            setProducts(products =>
                products.map(prod => {
                    return prod.id === id ? updLike(operatorVar) : prod;
                })
            );

        if (localStorage[`liked${id}`]) {
            await fetching.putResourse("./api/set_like.php", {
                id: id,
                operator: "-",
            });
            sameSetProduct(likeMinus);
            localStorage.removeItem(`liked${id}`);
        } else {
            await fetching.putResourse("./api/set_like.php", {
                id: id,
                operator: "+",
            });
            sameSetProduct(likePlus);
            localStorage.setItem(`liked${id}`, "yes");
        }
    };

    const deleteProduct = async (id, imageFolder) => {
        const answer = confirm(`Are you sure you want to delete the item? №${id} entirely?`);
        if (answer) {
            await fetching.postResourse(`./api/delete_prod.php`, { id: +id, imageFolder: +imageFolder }).then(res => {
                setProducts(products =>
                    products
                        .filter(prod => {
                            return Number(prod.id) !== res;
                        })
                        .map((prod, i) => {
                            return {
                                ...prod,
                                id: Number(products[0].id) + i,
                            };
                        })
                );
                setPage(page => ({
                    ...page,
                    interval: page.interval - 1,
                    deleted: page.deleted + 1,
                }));
            });
        }
        editRef.current.getLastID();
    };

    const editProductClick = id => {
        setEditId(id);
        editRef.current.editProduct();
    };

    const loadMore = async () => {
        if (displayLoadBtn === true) {
            setLoading(true);
            const futurePage = {
                interval: page.interval,
                prevIntervals: (page.prevIntervals += page.interval),
            };
            await fetching.postResourse("./api/loadMore.php", futurePage).then(res => {
                if (res.length !== 0) {
                    setProducts(products => [...res, ...products]);
                    setPage({
                        prevIntervals: page.prevIntervals - page.deleted,
                        interval: defaulinterval,
                        deleted: 0,
                    });
                } else {
                    setDisplayLoadBtn(false);
                }
                setLoading(false);
            });
        }
    };

    const svgStyle = {
        margin: "10px auto",
        width: "45px",
        height: "45px",
        color: "#ff4656",
    };

    return (
        <section id="products" className="products">
            {console.log("ProductsRender")}
            <div className="container">
                <h2 className="h2">Buy beautiful, light women's clothing in the city of Dreams</h2>
                <ul className="products__wrap">
                    {pathname === "/admin" ? <AddProd ref={editRef} editId={editId} setProducts={setProducts} products={products} setPage={setPage} /> : null}
                    {[...products].reverse().map(prodArr => {
                        const { id, ...product } = prodArr;
                        return <Product key={id} id={id} {...product} onLike={onLike} deleteProduct={deleteProduct} editProductClick={editProductClick} />;
                    })}
                </ul>
                <button type="button" className="products__loadMore" onClick={() => loadMore()}>
                    {displayLoadBtn ? "Load more" : "And everything already, everything"}
                </button>
                {loading && <LoadingSvg style={svgStyle} />}
                <p className="products__descr">
                    Even more different dresses, blouses, sundresses, suits, etc. in our store. Come for light, beautiful and inexpensive women's clothing for
                    every day and holidays. Below is a detailed instruction on how to find us in the city.
                </p>
            </div>
        </section>
    );
};

export default Products;
