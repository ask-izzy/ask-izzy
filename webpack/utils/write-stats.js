// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// A webpack plugin to write webpack stats that can be consumed when rendering
// the page (e.g. it attach the public path to the script names)
// These stats basically contains the path of the script files to
// <script>-load in the browser.

import fs from "fs";
import path from "path";
import _ from "underscore";

var filepath = path.resolve(__dirname, "../../src/server/webpack-stats.json");

// Write only a relevant subset of the stats and attach the public path to it

module.exports = function writeStats(stats) {

    var publicPath = this.options.output.publicPath;

    var json = stats.toJson();

    // get chunks by name and extensions
    function getChunks(ext, chunkOrdering) {
        var chunks = [];
        var allChunkNames = Object.keys(json.assetsByChunkName);
        var unorderedChunks = _(allChunkNames).difference(chunkOrdering);
        var sortedChunkNames = chunkOrdering.concat(unorderedChunks);

        for (var name of sortedChunkNames) {

            var chunk = json.assetsByChunkName[name];

            // a chunk could be a string or an array, so make sure it is an array
            if (!(Array.isArray(chunk))) {
                chunk = [chunk];
            }

            chunks = chunks.concat(chunk
                 // filter by extension
                .filter(function(chunkName) {
                    return path.extname(chunkName) === "." + ext;
                })
                .map(function(chunkName) {
                    return publicPath + chunkName;
                })
            );
        }
        return chunks;
    }
    var script = getChunks("js", ["runtime", "vendor"]);
    var css = getChunks("css", []);

    var content = {
        script: script,
        css: css,
    };

    fs.writeFileSync(filepath, JSON.stringify(content, 0, 4));

};
