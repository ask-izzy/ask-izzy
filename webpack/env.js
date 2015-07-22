/* @flow */
import webpack           from "webpack";

module.exports = function(env: string) {
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
