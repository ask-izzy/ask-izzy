/* @flow */
// Webpack config for creating the script to inject during test.

const path = require("path");

const assetsPath: string = path.join(__dirname, "../public/static");

module.exports = {
    devtool: "source-map",
    entry: {
        testharness: [
            "./test/support/environment-setup-entry",
        ],
    },
    bail: true,
    output: {
        path: assetsPath,
        // We don't use a hash here since the output
        // file is referenced directly by the tests
        filename: "[name].js",
        publicPath: "/static/",
    },
    module: {
        rules: [
            {
                test: (/\.js$/: RegExp),
                use: ["babel-loader"],
            },
        ],
    },
};
