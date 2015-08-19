/* @flow */

import path from "path";
import express from "express";
import config from "./config";
import render from "./server/render";

// Initialize express server

if (!process.env.ISS_URL) {
    console.error("Must set ISS_URL");
    process.exit(1);
}

var server = express();

// In production, nginx will serve these files so
// we won't actually recieve requests for them.
server.use(express.static(path.resolve(__dirname, "../public"), {
    maxAge: 0,
}));

// On development, serve the static files from the webpack dev server.
if (server.get("env") === "development") {
    require("../webpack/server");
}

// Render the app server-side and send it as response
server.use(render);

// Generic server errors (e.g. not caught by components)
server.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
    console.log("Error on request %s %s", req.method, req.url);
    console.log(err);
    console.log(err.stack);
    res.status(500).send("Something bad happened");
});

// Finally, start the express server
server.set("port", process.env.PORT || 8000);

server.listen(server.get("port"), () => {
    var env = server.get("env");
    var port = server.get("port");
    console.log(
        `Express ${env} server listening on ${port}`
    );
});

