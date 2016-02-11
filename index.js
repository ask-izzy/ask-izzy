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

// Pass through environment variables
GLOBAL.ISS_URL = process.env.ISS_URL;
GLOBAL.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
GLOBAL.GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;
GLOBAL.GOOGLE_TAG_MANAGER_ID = process.env.GOOGLE_TAG_MANAGER_ID;

if (process.argv[2] && (process.argv[2] != "index.js")) {
    var content = require("./" + process.argv[2]);
    if (typeof content == "function") {
        content();
    }
} else {
    // Start the server app
    require("./src/server");
}
