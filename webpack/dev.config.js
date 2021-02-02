/* flow:disable */

// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// This is the webpack config to use during development.
// It enables the hot module replacement,
// the source maps and inline CSS styles.

import path from "path";
import webpack from "webpack";
import writeStats from "./utils/write-stats";
import notifyStats from "./utils/notify-stats";
import commons from "./utils/commons";
import env from "./env";
import progress from "./utils/progress";
import extractText from "./extract-text";

const assetsPath = path.resolve(__dirname, "../public/static");

const WEBPACK_HOST = process.env.HOST || "localhost";
const WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 3001;
const webpackUrl = `http://${WEBPACK_HOST}:${WEBPACK_PORT}`;

module.exports = {
    devtool: "#source-map",
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
                test: /\.(jpe?g|png|gif)$/,
                use: "file-loader",
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "@svgr/webpack",
                    },
                ],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: extractText.loader,
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

        extractText.plugin,

        commons,

        // stats
        function() {
            this.plugin("done", notifyStats);
        },

        function() {
            this.plugin("done", writeStats);
        },

        progress(),

    ],
};
