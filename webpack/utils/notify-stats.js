/* $FlowIgnore */
// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23
// A webpack plugin to notify errors and warning when compiling

function notifyError(error) {
    // BELLs when something goes wrong!
    console.log("\x07" + error);
}

function notifyWarning(warning) {
    console.log(warning);
}

module.exports = function notifyStats(stats: webpackStats) {
    const json = stats.toJson();

    if (json.errors.length > 0) {
        json.errors.forEach(notifyError);
    } else if (json.warnings.length > 0) {
        json.warnings.forEach(notifyWarning);
    } else {
        console.log(stats.toString({
            chunks: false,
            colors: true,
        }));
    }
};
