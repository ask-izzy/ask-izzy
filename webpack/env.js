/* @flow */
const webpack = require("webpack");

module.exports = function(env) {

    // Do not set sensitive stuff here (eg ISS_URL);
    // we deploy the same assets to prod as we do staging
    // so it can't be baked in.
    return new webpack.DefinePlugin({
        "process.env": {

            // Mainly used to require CSS files with webpack,
            // which can happen only on browser
            // Used as `if (process.env.BROWSER)...`
            BROWSER: JSON.stringify(true),

            // Reduce the size of client-side libraries,
            // e.g. react by allowing dead code to be removed
            NODE_ENV: JSON.stringify(env),
        },
    });
};
