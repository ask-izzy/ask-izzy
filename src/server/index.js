/* @flow */

import path from "path";
import express from "express";
import render from "./render";

declare var GLOBAL: Object;

if (!process.env.ISS_URL) {
    console.error("Must set ISS_URL");
    process.exit(1);
}

if (!process.env.GOOGLE_KEY) {
    console.warn("GOOGLE_KEY not set");
}

// On the client, we set these variables on `window`
// Making them globals on the server means the same
// code can be used.
GLOBAL.ISS_URL = process.env.ISS_URL;
GLOBAL.GOOGLE_KEY = process.env.GOOGLE_KEY;
GLOBAL.SITE_DOMAIN = process.env.SITE_DOMAIN;
GLOBAL.GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;

// Initialize express server
const server = express();

// In production, nginx will serve these files so
// we won't actually recieve requests for them.
server.use(express.static(path.resolve(__dirname, "../../public"), {
    maxAge: 0,
}));

// Render the app server-side and send it as response
server.use(render);

// Generic server errors (e.g. not caught by components)
server.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
    console.error("Error on request %s %s", req.method, req.url);
    console.error(err);
    console.error(err.stack);
    res.status(500).send("Something bad happened");
});

// Finally, start the express server
server.set("port", process.env.PORT || 8000);

server.listen(server.get("port"), () => {
    const env = server.get("env");
    const port = server.get("port");

    console.info(`Express ${env} server listening on ${port}`);
});
