/* @flow */

// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// A webpack plugin to write webpack stats that can be consumed when rendering
// the page (e.g. it attach the public path to the script names)
// These stats basically contains the path of the script files to
// <script>-load in the browser.

const fs = require("fs");
const path = require("path");
const _ = require("underscore");

const filepath = path.resolve(
    __dirname,
    "../../src/server/webpack-stats.json"
);

// Write only a relevant subset of the stats and attach the public path to it

module.exports = function writeStats(stats: webpackStats) {

    const publicPath = this.options.output.publicPath;
    const json = stats.toJson();

    // get chunks by name and extensions
    function getChunks(ext, chunkOrdering) {
        let chunks = [];
        let allChunkNames = Object.keys(json.assetsByChunkName);
        let unorderedChunks = _(allChunkNames).difference(chunkOrdering);
        let sortedChunkNames = chunkOrdering.concat(unorderedChunks);

        for (let name of sortedChunkNames) {
            if (json.assetsByChunkName[name]) {
                let chunk = json.assetsByChunkName[name];

                // a chunk could be a string or an array, so make sure it is
                // an array
                if (!(Array.isArray(chunk))) {
                    chunk = [chunk];
                }

                chunks = chunks.concat(chunk
                    .filter((name) => path.extname(name) === `.${ext}`)
                    .map((name) => publicPath + name)
                );
            }
        }
        return chunks;
    }

    const script = getChunks("js", [
        "runtime", "hotload", "vendor", "testharness", "main",
    ]);
    const css = getChunks("css", []);
    const content = {
        script: script,
        css: css,
    };

    fs.writeFileSync(filepath, JSON.stringify(content, undefined, 4));

};
