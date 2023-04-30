const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    // entry: path.resolve(__dirname, 'src/index.js'),
    entry: ["regenerator-runtime/runtime.js", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        clean: true,
        assetModuleFilename: "./assets/[name][ext]",
    },
    // devtool: "source-map",
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
        port: 3005,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(mp4|png|svg|jpg|jpeg|gif|webp|woff|woff2)$/i,
                type: "asset/resource",
            },
            {
                test: /\.[tj]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack",
            filename: "index.html",
            template: "src/index.html",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/api/"),
                    to: path.resolve(__dirname, "dist/api"),
                },
                {
                    from: path.resolve(__dirname, "src/robots.txt"),
                    to: path.resolve(__dirname, "dist/"),
                },
            ],
        }),
    ],
    resolve: {
        extensions: [".js", ".jsx", ".tsx"],
    },
};
