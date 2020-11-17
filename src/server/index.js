/* @flow */

import path from "path";
import express from "express";
import render from "./render";

import requireVars from "./require-vars";

requireVars();

// Initialize express server
const server = express();

// React pages aren't etag-friendly
server.set("etag", false);

// Render the app server-side and send it as response
server.use(render);

// In production, nginx will serve these files so
// we won't actually recieve requests for them.
server.use(express.static(path.resolve(__dirname, "../../public"), {
    maxAge: 0,
}));

// Generic server errors (e.g. not caught by components)
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error("Error on request %s %s", req.method, req.url);
    console.error(err);
    console.error(err.stack);
    res.status(500).send("Something bad happened");
});

// Finally, start the express server
server.set("port", process.env.PORT || 8000);

server.listen(server.get("port"), "0.0.0.0", () => {
    const env = server.get("env");
    const port = server.get("port");

    console.info(`Express ${env} server listening on ${port}`);
});

export default server