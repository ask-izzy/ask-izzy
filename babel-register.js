/* @flow */
/*
 * Registers babel so that node can require both flow (.js/.jsx) and
 * typescript (.ts/.tsx) source files at runtime. Use this instead of requiring
 * "@babel/register" directly.
 */

// $FlowIgnore
require("@babel/register")({
    extensions: [".js", ".jsx", ".ts", ".tsx"],
})
