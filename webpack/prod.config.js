// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// Webpack config for creating the production bundle.

import path              from "path";
import webpack           from "webpack";
import writeStats        from "./utils/write-stats";
import strip             from "strip-loader";
import env               from "./env";
import extractText       from "./extract-text";

var assetsPath = path.join(__dirname, "../public/static");

module.exports = {
    devtool: "source-map",
    entry: {
        main: [
            "./src/client-entry.js",
            "./src/styles/bundle.scss",
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
                loader: extractText.loaders,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [strip.loader("debug"), "babel"],
            },
        ],
    },
    progress: true,
    plugins: [

        // ignore dev config
        new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

        // set global vars
        env("production"),

        // polyfill window.fetch et al client-side
        new webpack.ProvidePlugin({
            'es6-promise': 'es6-promise',
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

        // stats
        function() { this.plugin("done", writeStats); },

    ],
};
