/* @flow */

var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var compiler = webpack(require("../../webpack.config"));
var express = require('express');

export default function(app: express): void {
    // Webpack bundling
    app.use(
        webpackDevMiddleware(compiler, {
            noInfo: false, // log info, warnings and errors
            quiet: false,  // true would disable all console output
            lazy: false,   // true means no watching, but recompilation on every request
            watchOptions: {
                aggregateTimeout: 300,
                poll: true
            },
            publicPath: "/",
            headers: { "X-Webpack-Dev": "true" }, // mark requests handled by this middleware
            stats: {
                // Pretty-print console statistics
                colors: true
            }
        })
    );

}
