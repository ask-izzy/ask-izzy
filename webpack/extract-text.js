/* @flow */

import ExtractTextPlugin from "extract-text-webpack-plugin";

const cssExtractor = new ExtractTextPlugin(
    "[name]-[chunkhash].css",
    {allChunks: true},
);

export default {
    plugin: cssExtractor,
};
