// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// Webpack config for creating the production bundle.

import path              from "path";
import webpack           from "webpack";
import writeStats        from "./utils/write-stats";
import strip             from "strip-loader";

var assetsPath = path.join(__dirname, "../public/assets");

module.exports = {
    devtool: "source-map",
    entry: {
        main: "./src/client-entry.js",
    },
    output: {
        path: assetsPath,
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[chunkhash].js",
        publicPath: "/assets/",
    },
    module: {
        loaders: [
            { test: /\.(jpe?g|png|gif|svg|css)$/, loader: "file" },
            { test: /\.css$/, loader: "style!css" },
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
        new webpack.DefinePlugin({
            "process.env": {

                // Mainly used to require CSS files with webpack,
                // which can happen only on browser
                // Used as `if (process.env.BROWSER)...`
                BROWSER: JSON.stringify(true),

                // Reduce the size of client-side libraries,
                // e.g. react by allowing dead code to be removed
                NODE_ENV: JSON.stringify("production"),
            },
        }),

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
