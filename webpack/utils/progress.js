/* @flow */

import webpack from "webpack";

// Show build progress in development
export default function() {
    return new webpack.ProgressPlugin(function(percentage, message) {
        var MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
        var CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();
        process.stdout.write(
            CLEAR_LINE +
            Math.round(percentage * 100) +
            "% :" +
            message +
            MOVE_LEFT
        );
    });
}
