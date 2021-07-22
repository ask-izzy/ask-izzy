/* @flow */

import webpack from "webpack";

// CommonsChunkPlugin has been replaced and while it still appears to exist it's
// not typed. We should move to SplitChunksPlugin at some point for now we'll
// just disable typechecking.
// $FlowIgnore
module.exports = new webpack.optimize.CommonsChunkPlugin({
    name: "runtime",

    filename: "webpack-runtime-[hash].js",
    // (Give the chunk a different name)

    minChunks: Infinity,
    // (with more entries, this ensures that no other module
    //  goes into the vendor chunk)
});
