/* @flow */

// Register babel to have ES6 support
require("babel-core/register");
require("babel-polyfill");
module.exports = require("./prod.config");
