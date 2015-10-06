/* @flow */

import webpack from "webpack";

module.exports = new webpack.optimize.CommonsChunkPlugin({
  name: "runtime",

  filename: "webpack-runtime-[hash].js",
  // (Give the chunk a different name)

  minChunks: Infinity,
  // (with more entries, this ensures that no other module
  //  goes into the vendor chunk)
});
