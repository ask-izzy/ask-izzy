/* @flow */

const webpack = require("webpack");
import typeof Webpack from "webpack";

// Show build progress in development
module.exports = function(): $PropertyType<
    $PropertyType<Webpack, 'DefinePlugin'>,
    'constructor'
    > {
    // $FlowIgnore For some reason ProgressPlugin doesn't appear to be typed
    return new webpack.ProgressPlugin((percentage, message) => {
        const MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
        const CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();

        process.stdout.write(
            CLEAR_LINE +
            Math.round(percentage * 100) +
            "% :" +
            message +
            MOVE_LEFT
        );
    });
}
