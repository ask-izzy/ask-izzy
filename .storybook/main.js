/* $FlowIgnore */

const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

require("@babel/register");
require("core-js");
require("regenerator-runtime/runtime");
const webpackConfig = require("../webpack/dev.config.js");

const versionFilePath = "public/VERSION"
const askIzzyBuildVersion = fs.existsSync(versionFilePath) &&
    fs.readFileSync(versionFilePath, "utf-8").trim();

const clientEnvPath = process.env.NODE_ENV === "development" ?
    "/static/env.js"
    : `/static/env-${askIzzyBuildVersion}.js`

module.exports = {
    stories: [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "storybook-addon-apollo-client",
        "storybook-addon-designs",
    ],
    webpackFinal: (config) => {
        const bannerImages = fs
            .readdirSync("./public/static/images/banners")
            .map((file) => file.replace(/\.\w*$/, ""));

        config.module.rules.push(
            ...webpackConfig.module.rules
        )

        config.plugins.push(
            new MiniCssExtractPlugin(),
            new webpack.DefinePlugin({
                "storyBookControlValues.HeaderBar.bannerName": JSON
                    .stringify(bannerImages),
                "clientEnvPath": JSON
                    .stringify(clientEnvPath),
            }),
        )

        return config
    },
    features: {
        postcss: false, // hide deprecation warning, won't be needed in future https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-implicit-postcss-loader
    },
};
