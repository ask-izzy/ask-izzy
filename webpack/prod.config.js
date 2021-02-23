/* $FlowIgnore */

// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// Webpack config for creating the production bundle.

const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const env = require("./env");

const assetsPath = path.join(__dirname, "../public/static");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WriteStatsPlugin = require("./utils/write-stats.js");
const bannerImages = fs.readdirSync("./public/static/images/banners")
    .map(file => file.replace(/\.\w*$/, ""));

module.exports = {
    mode: "production",
    devtool: "source-map",
    entry: {
        main: [
            "./src/client-entry.js",
            "./src/styles/bundle.scss",
            "./src/analytics.js",
        ],
    },
    bail: true,
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
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: `postcss-loader`,
                        options: {
                            options: {},
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            data: `$banner-images: ${bannerImages.join(" ")};`,
                        },
                    },
                ],
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

        new MiniCssExtractPlugin(),

        // Output bundles to JSON.
        new WriteStatsPlugin(),

    ],
};

