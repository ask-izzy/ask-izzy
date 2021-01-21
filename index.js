#!/usr/bin/env node
delete process.env.BROWSER;

if (!process.env.NODE_ENV) {
    throw new Error(
        "You must specify a NODE_ENV of 'development' or 'production'"
    );
}

// Register babel to have ES6 support on the server
require("@babel/register");
require("core-js");
require("regenerator-runtime/runtime");

if (process.argv[3]) {
    throw new Error("Too many arguments");
}

if (process.argv[2] && (process.argv[2] != "index.js")) {
    var content = require("./" + process.argv[2]);
    if (typeof content === "function") {
        content();
    }
} else {
    // Start the server app
    require("./src/server");
}
