/*
 * Registers babel so that node can require typescript (.ts/.tsx) source files
 * at runtime. Use this instead of requiring "@babel/register" directly.
 */
require("@babel/register")({
    extensions: [".js", ".jsx", ".ts", ".tsx"],
})
