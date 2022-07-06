/* $FlowIgnore */

const fs = require("fs");
const webpack = require("webpack");

module.exports = {
    stories: [
        "../components/**/*.stories.mdx",
        "../components/**/*.stories.@(js|jsx|ts|tsx)",
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "storybook-addon-apollo-client",
        "storybook-addon-designs",
        "storybook-addon-next",
    ],
    webpackFinal: (config) => {
        // Needed for @jsonforms package
        config.resolve.fallback.http = false
        config.resolve.fallback.https = false

        const bannerImages = fs
            .readdirSync("./public/images/banners")
            .map((file) => file.replace(/\.\w*$/, ""));

        config.plugins.push(
            new webpack.DefinePlugin({
                "storyBookControlValues.HeaderBar.bannerName": JSON
                    .stringify(bannerImages),
            }),
        )

        return config
    },
    features: {
        postcss: false, // hide deprecation warning, won't be needed in future https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-implicit-postcss-loader
    },
    core: {
        builder: "webpack5",
    },
};
