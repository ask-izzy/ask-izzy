// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// Webpack config for creating the production bundle.

import path              from "path";
import webpack           from "webpack";
import writeStats        from "./utils/write-stats";
import strip             from "strip-loader";
import env               from "./env";

var assetsPath = path.join(__dirname, "../public/static");

module.exports = {
    devtool: "source-map",
    entry: {
        main: "./src/client-entry.js",
    },
    output: {
        path: assetsPath,
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js",
        publicPath: "/static/",
    },
    resolve: {
        alias: {
            "node-fetch": "whatwg-fetch",
        },
    },
    module: {
        postLoaders: [
          { test: /\.js$/, loader: "transform?envify" },
        ],
        loaders: [
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: "file",
            },
            {
                test: /\.css$/,
                loader: "style!css",
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass",
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
