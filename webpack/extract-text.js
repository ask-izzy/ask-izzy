/* @flow */

import ExtractTextPlugin from "extract-text-webpack-plugin";
import cssLoaders from "./css-loaders";

const cssExtractor = new ExtractTextPlugin({
    filename: "[name]-[contenthash].css",
    allChunks: true,
});

export default {
    plugin: cssExtractor,
    loader: ExtractTextPlugin.extract(cssLoaders),
};
