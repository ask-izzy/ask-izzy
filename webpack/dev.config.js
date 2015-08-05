// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// This is the webpack config to use during development.
// It enables the hot module replacement,
// the source maps and inline CSS styles.

import path        from "path";
import webpack     from "webpack";
import writeStats  from "./utils/write-stats";
import notifyStats from "./utils/notify-stats";
import env         from "./env";
import progress    from "./progress";

var assetsPath = path.resolve(__dirname, "../public/static");

var WEBPACK_HOST = "localhost";
var WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 3001;
var webpackUrl = `http://${WEBPACK_HOST}:${WEBPACK_PORT}`;

module.exports = {
    devtool: "#source-map",
    entry: {
        main: "./src/client-entry.js",
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
                loaders: ["babel?cacheDirectory"],
            },
        ],
    },
    progress: true,
    plugins: [

        new webpack.NoErrorsPlugin(),

        env("development"),

        // polyfill window.fetch et al client-side
        new webpack.ProvidePlugin({
            'es6-promise': 'es6-promise',
        }),

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
