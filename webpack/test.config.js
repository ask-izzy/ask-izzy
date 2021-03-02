/* @flow */
// Webpack config for creating the script to inject during test.

const path = require("path");

const assetsPath = path.join(__dirname, "../public/static");

module.exports = {
    devtool: "source-map",
    entry: "./test/support/environment-setup-entry",
    bail: true,
    output: {
        path: assetsPath,
        filename: "testharness.js",
        publicPath: "/static/",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
            },
        ],
    },
};
