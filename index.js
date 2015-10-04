delete process.env.BROWSER;

if (!process.env.NODE_ENV) {
    throw new Error(
        "You must specify a NODE_ENV of 'development' or 'production'"
    );
}

// Register babel to have ES6 support on the server
require("babel/register");

if (process.env.NEW_RELIC_KEY) {
    require('newrelic');
} else {
    console.warn("NEW_RELIC_KEY not set");
}

if (process.argv[3]) {
    throw new Error("Too many arguments");
}

if (process.argv[2] && (process.argv[2] != "index.js")) {
    require("./" + process.argv[2]);
} else {
    // Start the server app
    require("./src/server");
}
