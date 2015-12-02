/* @flow */

import ExtractTextPlugin from "extract-text-webpack-plugin";
import cssLoaders from "./css-loaders";

const cssExtractor = new ExtractTextPlugin(
    "[name]-[chunkhash].css",
    {allChunks: true},
);

export default {
    plugin: cssExtractor,
    loader: ExtractTextPlugin.extract(cssLoaders),
};
