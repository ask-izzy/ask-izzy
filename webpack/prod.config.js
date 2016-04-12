/* flow:disable */

// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// Webpack config for creating the production bundle.

import path from "path";
import webpack from "webpack";
import writeStats from "./utils/write-stats";
import commons from "./utils/commons";
import env from "./env";
import extractText from "./extract-text";

const assetsPath = path.join(__dirname, "../public/static");

module.exports = {
    devtool: "source-map",
    entry: {
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
    },
    output: {
        path: assetsPath,
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js",
        publicPath: "/static/",
    },
    module: {
        loaders: [
            {
                test: /\.(jpe?g|png|gif|svg)$/,
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
                loaders: ["es3ify", "babel"],
            },
        ],
    },
    progress: true,
    plugins: [

        // Only load the en-au moment.js config
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-au/),

        // set global vars
        env("production"),

        // polyfill window.fetch et al client-side
        new webpack.ProvidePlugin({
            "es6-promise": "es6-promise",
        }),

        extractText.plugin,

        // optimizations
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
        commons,

        // stats
        function() {
            this.plugin("done", writeStats);
        },
    ],
};

