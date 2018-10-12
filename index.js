#!/usr/bin/env node
delete process.env.BROWSER;

if (!process.env.NODE_ENV) {
    throw new Error(
        "You must specify a NODE_ENV of 'development' or 'production'"
    );
}

// Register babel to have ES6 support on the server
require("babel-core/register");
require("babel-polyfill");

if (process.argv[3]) {
    throw new Error("Too many arguments");
}

// Pass through environment variables
global.ISS_URL = process.env.ISS_URL;
global.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
global.GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;
global.GOOGLE_TAG_MANAGER_ID = process.env.GOOGLE_TAG_MANAGER_ID;

if (process.argv[2] && (process.argv[2] != "index.js")) {
    var content = require("./" + process.argv[2]);
    if (typeof content == "function") {
        content();
    }
} else {
    // Start the server app
    require("./src/server");
}
