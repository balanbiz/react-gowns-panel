import { Component } from "react";

class ErrorBoundary extends Component {
    state = {
        error: false,
    };

    componentDidCatch(err, info) {
        console.log(err, info);
        this.setState({
            error: true,
        });
    }

    render() {
        if (this.state.error) {
            return "An error has occurred in this component!";
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
