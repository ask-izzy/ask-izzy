/* $FlowIgnore */

// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// This is the webpack config to use during development.
// It enables the hot module replacement,
// the source maps and inline CSS styles.

const path = require("path");
const webpack = require("webpack");
const writeStats = require("./utils/write-stats");
const fs = require("fs");
const env = require("./env");
const progress = require("./utils/progress");

const assetsPath = path.resolve(__dirname, "../public/static");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WEBPACK_HOST = process.env.HOST || "localhost";
const WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 3001;
const webpackUrl = `http://${WEBPACK_HOST}:${WEBPACK_PORT}`;
const bannerImages = fs.readdirSync("./public/static/images/banners")
    .map(file => file.replace(/\.\w*$/, ""));


module.exports = {
    mode: "development",
    devtool: "#source-map",
    devServer: {
        port: 3000,
        contentBase: path.join(__dirname, "../public"),
    },
    entry: {
        hotload: [
            `webpack-dev-server/client?${webpackUrl}`,
            "webpack/hot/only-dev-server",
        ],
        main: [
            "./src/client-entry.js",
            "./src/styles/bundle.scss",
            "./src/analytics.js",
        ],
    },
    output: {
        path: assetsPath,
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js",
        publicPath: webpackUrl + "/static/",
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: "file-loader",
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: `postcss-loader`,
                        options: {
                            options: {},
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            data: `$banner-images: ${bannerImages.join(" ")};`,
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                // Exceptions to exclusions needed because UglifyJs can't handle
                // ES6 so modules using ES6 features need to be run though babel
                // first. When we get around to upgrading our minifier we should
                // be able to remove these exclusions.
                exclude: /node_modules\/(?!posthog-js|is-plain-obj)/,
                use: ["babel-loader"],
            },
        ],
    },
    plugins: [
        env("development"),

        // Only load the en-au moment.js config
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-au/),

        new webpack.HotModuleReplacementPlugin(),

        // polyfill window.fetch et al client-side
        new webpack.ProvidePlugin({
            "es6-promise": "es6-promise",
        }),

        new MiniCssExtractPlugin(),

        progress(),

        // stats
        writeStats(),
        

    ],
};
