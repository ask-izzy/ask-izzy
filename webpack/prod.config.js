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
            "./src/analytics.js",
        ],
    },
    output: {
        path: assetsPath,
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js",
        publicPath: "/static/",
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: "file-loader",
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

        // Only load the en-au moment.js config
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-au/),

        // set global vars
        env("production"),

        // polyfill window.fetch et al client-side
        new webpack.ProvidePlugin({
            "es6-promise": "es6-promise",
        }),

        extractText.plugin,

        // optimizations
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            sourceMap: true,
        }),
        commons,

        // stats
        function() {
            this.plugin("done", writeStats);
        },
    ],
};

