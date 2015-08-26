import ExtractTextPlugin from "extract-text-webpack-plugin";

var cssExtractor = new ExtractTextPlugin(
    '[name]-[chunkhash].css',
    {allChunks: true},
);

module.exports = {
    plugin: cssExtractor,
    loaders: cssExtractor.extract(
        "style-loader",
        "css-loader!autoprefixer-loader?browsers=last 3 versions!sass-loader"
    ),
};
