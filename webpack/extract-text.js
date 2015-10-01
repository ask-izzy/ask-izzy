import ExtractTextPlugin from "extract-text-webpack-plugin";

var cssExtractor = new ExtractTextPlugin(
    '[name]-[chunkhash].css',
    {allChunks: true},
);

export default {
    plugin: cssExtractor,
};
