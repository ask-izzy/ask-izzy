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
        ],
        vendor: [
            "core-decorators",
            "moment",
            "react",
            "react-google-maps",
            "react-router",
            "underscore",
            "underscore.string",
        ],
        googleanalytics: [
            "./src/google-analytics.js",
        ],
        googlemapsapi: [
            "./public/static/google-maps-api.js",
        ],
    },
    output: {
        path: assetsPath,
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js",
        publicPath: webpackUrl + "/static/",
    },
    module: {
        loaders: [
            {
                test: /\.(jpe?g|png|gif|svg|json)$/,
                loader: "file",
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: extractText.loader,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ["es3ify", "babel?cacheDirectory"],
            },
        ],
    },
    progress: true,
    plugins: [
        env("development"),

        // Only load the en-au moment.js config
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-au/),

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
