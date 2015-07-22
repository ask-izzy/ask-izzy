// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// This is the webpack config to use during development.
// It enables the hot module replacement,
// the source maps and inline CSS styles.

import path        from "path";
import webpack     from "webpack";
import writeStats  from "./utils/write-stats";
import notifyStats from "./utils/notify-stats";

var assetsPath = path.resolve(__dirname, "../public/assets");

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
        publicPath: webpackUrl + "/assets/",
    },
    module: {
        loaders: [
            { test: /\.(jpe?g|png|gif|svg)$/, loader: "file" },
            { test: /\.css$/, loader: "style!css" },
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

        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development"),

                // Mainly used to require CSS files with webpack,
                // which can happen only on browser
                // Used as `if (process.env.BROWSER)...`
                BROWSER: JSON.stringify(true),
            },
        }),

        // stats
        function() {
            this.plugin("done", notifyStats);
        },

        function() {
            this.plugin("done", writeStats);
        },

        // print a webpack progress
        new webpack.ProgressPlugin(function(percentage, message) {
            var MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
            var CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();
            process.stdout.write(
                CLEAR_LINE +
                Math.round(percentage * 100) +
                "% :" +
                message +
                MOVE_LEFT
            );
        }),

    ],
};
