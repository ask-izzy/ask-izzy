/* @flow */
const path = require('path')
const klaw = require('klaw')

/**
 * Export a function to be used as webpack as a loader
 */
module.exports = function(content: string, map: ?Object, meta: ?Object) {
  main(content, map, meta, this.async());
};

/**
 * Find all style files and include them
 */
async function main (content, map, meta, callback) {
    const filesToInclude = await getScssFiles('./src');
    content = content.replace(
        /\/\*[\s\S]+?AUTO DETECTED STYLES LOADED HERE[\s\S]+?\*\//,
        filesToInclude
            .filter(file => !file.startsWith('styles/'))
            .map(file => `@import "../${file}";`)
            .join('\n')
    );
    callback(null, content, map, meta);
}

/**
 * For a given directory return a list of any .sass files contained within.
 *
 * eg getScssFiles('foo/bar') might return ['style.sass', 'more/styles.sass']
 */
async function getScssFiles(dir) {
    const files = await new Promise(resolve => {
        const files = []
        klaw(dir)
            .on('data', file => files.push(file.path))
            .on('end', () => resolve(files))
    })
    const absoluteDir = path.resolve(dir) + '/'
    return files
        .filter(file => file.match(/\.scss$/))
        .map(file => file.replace(new RegExp(`^${absoluteDir}`), ''))
        .sort()
}
