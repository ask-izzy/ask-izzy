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

// Start the server app
require("./src/server");
