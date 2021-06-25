/* $FlowIgnore */

// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// This is the webpack config to use during development.
// It enables the hot module replacement,
// the source maps and inline CSS styles.

import path from "path";
import webpack from "webpack";
import fs from "fs";
import env from "./env";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WriteStatsPlugin from "./utils/write-stats.js";
import progress from "./utils/progress";

const assetsPath = path.resolve(__dirname, "../public/static");
const bannerImages = fs.readdirSync("./public/static/images/banners")
    .map(file => file.replace(/\.\w*$/, ""));


module.exports = {
    mode: "development",
    devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, "../public"),
    },
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
                    {
                        loader: "./script/find-and-load-styles.js",
                    },
                ],
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                include: [
                    path.resolve("fixtures"),
                    path.resolve("src"),

                    // Modules using ES6 features need to be run though babel
                    // first. When we get around to upgrading our minifier we
                    // should be able to remove these inclusions.
                    path.resolve("node_modules/posthog-js"),
                    path.resolve("node_modules/is-plain-obj"),
                    path.resolve("node_modules/@googlemaps/js-api-loader"),
                    path.resolve("node_modules/mdast-util-find-and-replace"),
                ],
                use: ["babel-loader"],
            },
        ],
    },
    plugins: [
        env("development"),

        // Only load the en-au moment.js config
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-au/),

        new webpack.HotModuleReplacementPlugin(),

        // polyfill window.fetch et al client-side
        new webpack.ProvidePlugin({
            "es6-promise": "es6-promise",
        }),

        new MiniCssExtractPlugin({
            filename: "[name]-[hash].css",
        }),

        progress(),

        // Output bundles to JSON.
        new WriteStatsPlugin(),

    ],
};
