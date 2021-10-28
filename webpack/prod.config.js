/* $FlowIgnore */

// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// Webpack config for creating the production bundle.

import path from "path";
import webpack from "webpack";
import fs from "fs";
import env from "./env";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WriteStatsPlugin from "./utils/write-stats.js";

const versionFilePath = "public/VERSION"
const askIzzyBuildVersion = fs.existsSync(versionFilePath) &&
    fs.readFileSync(versionFilePath, "utf-8").trim();

const assetsPath = path.join(__dirname, "../public/static");
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
        filename: `[name]-${askIzzyBuildVersion}.js`,
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
                            additionalData:
                                `$banner-images: ${bannerImages.join(" ")};`,
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
                    path.resolve("node_modules/is-plain-obj"),
                    path.resolve("node_modules/@googlemaps/js-api-loader"),
                    path.resolve(
                        "node_modules/@react-google-maps/api/node_modules/" +
                            "@googlemaps/js-api-loader"
                    ),
                    path.resolve("node_modules/mdast-util-find-and-replace"),
                    path.resolve("node_modules/color-convert"),
                    path.resolve("node_modules/json-schema-ref-parser"),
                    path.resolve("node_modules/ono"),
                    path.resolve("node_modules/escape-string-regexp"),
                ],
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

        new MiniCssExtractPlugin({
            filename: `[name]-${askIzzyBuildVersion}.css`,
        }),

        // Output bundles to JSON.
        new WriteStatsPlugin(),

    ],
};

