// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// This is the webpack config to use during development.
// It enables the hot module replacement,
// the source maps and inline CSS styles.

import path        from "path";
import webpack     from "webpack";
import writeStats  from "./utils/write-stats";
import notifyStats from "./utils/notify-stats";
import commons     from "./utils/commons";
import env         from "./env";
import progress    from "./utils/progress";
import extractText from "./extract-text";

var assetsPath = path.resolve(__dirname, "../public/static");

var WEBPACK_HOST = "localhost";
var WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 3001;
var webpackUrl = `http://${WEBPACK_HOST}:${WEBPACK_PORT}`;

module.exports = {
    devtool: "#source-map",
    entry: {
        main: [
            "./src/client-entry.js",
            "./src/styles/bundle.scss",
        ],
        vendor: ["react", "material-ui", "core-decorators", "material-ui", "moment", "react-google-maps", "react-router", "react-tap-event-plugin", "react", "underscore.string", "underscore"],
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
                loader: extractText.loaders,
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
