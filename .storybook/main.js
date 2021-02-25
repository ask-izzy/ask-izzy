const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

require("@babel/register");
require("core-js");
require("regenerator-runtime/runtime");
const webpackConfig = require("../webpack/dev.config.js");

module.exports = {
    stories: [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
    webpackFinal: (config) => {
        const bannerImages = fs
            .readdirSync("./public/static/images/banners")
            .map((file) => file.replace(/\.\w*$/, ""));

        return {
            ...config,
            module: {
                ...webpackConfig.module,
                rules: webpackConfig.module.rules,
            },
            entry: [...config.entry, "./src/styles/bundle.scss"],
            plugins: [
                ...config.plugins,
                new MiniCssExtractPlugin(),
                new webpack.DefinePlugin({
                    "storyBookControlValues.HeaderBar.bannerName": JSON
                        .stringify(bannerImages),
                }),
            ],
        };
    },
};
