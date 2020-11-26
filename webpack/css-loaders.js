/* @flow */
import fs from "fs";

const bannerImages = fs.readdirSync("./public/static/images/banners")
    .map(file => file.replace(/\.\w*$/, ""));

export default [
    "css-loader",
    "autoprefixer-loader?browsers=last 3 versions",
    {
        loader: "sass-loader",
        options: {
            data: `$banner-images: ${bannerImages.join(" ")};`,
        },
    },
    {
        loader: "./script/find-and-load-styles.js",
    },
];
