import "./AddProd.scss";
import { Component } from "react";
import Fetching from "../../../server/Fetching";
import LoadingSVg from "../../../assets/misc/loadingSvg";

// There is no custom input and fetching hooks becouse of class component
class AddProd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 1,
            imageFolder: 0,
            name: "",
            images: [],
            price: "",
            colour: "",
            colours: ["default"],
            related: { default: [] },
            colorRadioBtn: "default",
            editStatus: false,
            likes: 0,
            imageLoading: false,
            memoryLeft: 0,
        };
        this.fetching = new Fetching();
        this.handleInputChange = this.handleInputChange.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.getLastID = this.getLastID.bind(this);
        this.newProdPost = {};
        this.renderingSizes = [];
    }

    componentDidMount() {
        this.getLastID();
        this.setSizesRange(40, 60, 2, "S", "M", "L");
    }

    componentDidUpdate() {
        this.checkForCheckboxes();
    }

    async handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        if (name == "img[]") {
            this.setState({
                imageLoading: true,
            });
            const formData = new FormData();
            if (target.files.length < 10) {
                const files = [...target.files];
                files.forEach((file, i) => {
                    formData.append(`${this.state.imageFolder}image${i}`, file);
                });
                await this.fetching.postImageForm("./api/uploadImage.php", formData).then(res => this.setState({ images: res, imageLoading: false }));
            } else {
                alert("Не больше 9ти картинок!");
            }
        } else if (target.type == "checkbox" && value) {
            for (let key in this.state.related) {
                if (key === this.state.colorRadioBtn) {
                    this.setState({
                        related: {
                            ...this.state.related,
                            [this.state.colorRadioBtn]: [...this.state.related[this.state.colorRadioBtn], name],
                        },
                    });
                }
            }
        } else if (target.type === "checkbox" && !value) {
            for (let key in this.state.related) {
                if (key === this.state.colorRadioBtn) {
                    this.setState({
                        related: {
                            ...this.state.related,
                            [this.state.colorRadioBtn]: this.state.related[this.state.colorRadioBtn].filter(size => {
                                return size !== name;
                            }),
                        },
                    });
                }
            }
        } else if (target.type === "number") {
            this.setState({
                [name]: +value,
            });
        } else {
            this.setState({
                [name]: value,
            });
        }
    }

    checkForCheckboxes() {
        document.querySelectorAll(".addProd-size > input[type=checkbox]").forEach(checkbox => {
            if (this.state.related[this.state.colorRadioBtn].includes(checkbox.name)) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        });
        document.querySelectorAll(".addProd__colour > input[type=radio]").forEach(radio => {
            if (this.state.colorRadioBtn.includes(radio.value)) {
                radio.checked = true;
            } else {
                radio.checked = false;
            }
        });

        if (this.state.colours.length === 2) {
            document.querySelector(".addProd__colour > input[type=radio]").click();
        }

        if (this.state.images.length === 0) {
            document.querySelector(".addProd-form__wrap > input[type=file]").value = null;
        }
    }

    setSizesRange(min, max, step, ...additional) {
        const renderingSizes = [];

        for (let i = min; i <= max; i += step) {
            renderingSizes.push(i);
        }

        if (additional.length !== 0) {
            additional.forEach(one => {
                renderingSizes.push(one);
            });
        }

        return (this.renderingSizes = renderingSizes);
    }

    addColour() {
        if (this.state.colour === "") {
            alert("You must enter a color name");
        } else if (this.state.colours.includes(this.state.colour)) {
            alert("This color already exists!");
        } else {
            this.setState({
                colours: [...this.state.colours, this.state.colour],
                related: { ...this.state.related, [this.state.colour]: [] },
            });
        }
    }

    async getLastID() {
        await this.fetching.getResourse("./api/get_last_id.php").then(res => {
            if (res !== null) {
                this.setState({
                    id: +res.id + 1,
                    imageFolder: +res.imageFolder,
                    memoryLeft: res.memoryLeft,
                });
            }
        });
    }

    transformDataToPost() {
        const newProdPost = {
            id: this.state.id,
            imageFolder: this.state.imageFolder,
            name: this.state.name,
            images: this.state.images,
            price: this.state.price,
            related: this.state.related,
            likes: this.state.likes,
        };

        return (this.newProdPost = newProdPost);
    }

    async postNewProd() {
        this.transformDataToPost();
        if (this.state.images.length === 0 && !this.state.imageLoading) {
            alert("You need to choose an image");
        } else if (this.state.price === "") {
            alert("You need to enter a price");
        } else if (this.state.imageLoading) {
            alert("Please wait while images are loading.");
        } else {
            await this.fetching.postResourse("./api/post_new_prod.php", this.newProdPost).then(res => {
                this.props.setProducts([...this.props.products, res]);
                this.props.setPage(page => ({
                    ...page,
                    interval: page.interval + 1,
                    deleted: page.deleted - 1,
                }));
                this.getLastID();
            });
        }
    }

    onSubmit(e) {
        e.preventDefault();
    }

    deleteColour(oneColor) {
        const answer = confirm("Do you really want to remove the color " + oneColor);
        const theSameState = {
            colours: this.state.colours.filter(color => color != oneColor),
            related: Object.keys(this.state.related)
                .filter(color => color != oneColor)
                .reduce((color, sizes) => {
                    return {
                        ...color,
                        [sizes]: this.state.related[sizes],
                    };
                }, {}),
        };
        if (answer) {
            if (this.state.colours.length < 3) {
                this.setState({
                    colorRadioBtn: "default",
                    ...theSameState,
                });
            } else {
                const anotherValue = this.state.colours.filter(color => color != oneColor && color != "default")[0];
                // anotherValue = anotherValue[0];
                this.setState({
                    colorRadioBtn: anotherValue,
                    ...theSameState,
                });
            }
        }
    }

    editProduct() {
        if (this.props.editId !== "") {
            let editProd = {};
            this.props.products.forEach(product => {
                if (product.id === this.props.editId) {
                    editProd = product;
                }
            });

            const editColours = Object.keys(editProd.related);
            document.querySelector(".addProd-form__wrap > input[type=file]").value = null;

            this.setState({
                id: editProd.id,
                imageFolder: editProd.imageFolder,
                name: editProd.name,
                images: editProd.images,
                price: editProd.price,
                colour: "",
                colours: editColours,
                related: editProd.related,
                colorRadioBtn: editColours[0],
                likes: editProd.likes,
                editStatus: true,
            });
        }
    }

    async saveEditable() {
        const answer = confirm(`Do you really want to save product changes? №${this.props.editId}`);
        if (answer && !this.state.imageLoading) {
            this.transformDataToPost();
            await this.fetching.postResourse("./api/save_edit_prod.php", this.newProdPost).then(res => {
                const productsCopy = Array.from(this.props.products);

                for (let i = 0; i < productsCopy.length; i++) {
                    const elem = productsCopy[i];
                    if (elem.id === res.id) {
                        productsCopy[i] = res;
                    }
                }
                this.props.setProducts(productsCopy);
            });
            this.cancelEditable();
        }
    }

    cancelEditable() {
        this.setState({
            name: "",
            images: "",
            price: "",
            colour: "",
            colours: ["default"],
            related: { default: [] },
            colorRadioBtn: "default",
            likes: 0,
            editStatus: false,
        });
        this.getLastID();
    }

    render() {
        console.log("AddProdRender");
        return (
            <section className="addProd">
                <h3>{this.state.editStatus ? `Product editing №${this.props.editId}` : "Adding a new product"}</h3>
                <form className="addProd-form" action="#" onSubmit={this.onSubmit}>
                    {
                        <div className="addProd-form__wrap">
                            <label>name:</label>
                            <input type="text" name="name" value={this.state.name} onChange={this.handleInputChange} placeholder="Enter the title"></input>
                        </div>
                    }
                    <div className="addProd-form__wrap">
                        <label>Images{this.state.imageLoading && <LoadingSVg style={{ display: "inline-block", width: "40px", height: "40px" }} />}:</label>
                        <input type="file" name="img[]" accept="image/*" onChange={this.handleInputChange} className="addProd-form__wrap-file" multiple />
                    </div>
                    <div className="addProd-form__wrap">
                        <p>Server memory left: {Math.round((+this.state.memoryLeft / 1024 / 1024) * 0.95)}mb</p>
                    </div>
                    <div className="addProd-form__wrap">
                        <label>Price:</label>
                        <input type="number" name="price" value={this.state.price} onChange={this.handleInputChange} placeholder="Enter price"></input>
                    </div>
                    <div className="addProd-form__wrap">
                        <label>New color:</label>
                        <input type="text" name="colour" value={this.state.colour} onChange={this.handleInputChange} placeholder="Enter Color"></input>
                        <button style={this.state.colour != "" ? { color: "#ff4656" } : { color: "black" }} type="button" onClick={() => this.addColour()}>
                            Add
                        </button>
                    </div>
                    {this.state.colours.length > 1 ? (
                        <>
                            <div className="addProd__colours">
                                <div className="addProd__colours-header">Choose a color to bind the size:</div>
                                <div className="addProd__colours-wrap">
                                    {this.state.colours.map((oneColor, key) => {
                                        if (oneColor == "default") {
                                            return (
                                                <input
                                                    type="radio"
                                                    key={key}
                                                    style={{ display: "none" }}
                                                    name="colorRadioBtn"
                                                    value={oneColor}
                                                    onChange={this.handleInputChange}
                                                />
                                            );
                                        } else {
                                            return (
                                                <div key={key} className="addProd__colour">
                                                    <span onClick={() => this.deleteColour(oneColor)}>X</span>
                                                    <label>{oneColor}</label>
                                                    <input type="radio" name="colorRadioBtn" value={oneColor} onChange={this.handleInputChange} />
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </>
                    ) : null}
                    <div className="addProd-sizes">
                        <label>Sizes:</label>
                        <div className="addProd-sizes__wrap">
                            {this.renderingSizes.map((size, key) => {
                                return (
                                    <div className="addProd-size" key={key}>
                                        {size}
                                        <input type="checkbox" name={size} onChange={this.handleInputChange} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {this.state.editStatus ? (
                        <>
                            <button className="addProd-button" type="button" onClick={() => this.saveEditable()}>
                                Save changes
                            </button>
                            <button className="addProd-button" type="button" onClick={() => this.cancelEditable()}>
                                Cancel changes
                            </button>
                        </>
                    ) : (
                        <button className="addProd-button" type="button" onClick={() => this.postNewProd()}>
                            Create new product
                        </button>
                    )}
                </form>
            </section>
        );
    }
}

export default AddProd;
