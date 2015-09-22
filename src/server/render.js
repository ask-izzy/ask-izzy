// Express middleware to render the app server-side and expose its state
// to the client

import React from "react";
import Router from "react-router";
import routes from "../routes";

import HtmlDocument from "./HtmlDocument";

let webpackStats;

if (process.env.NODE_ENV === "production") {
    webpackStats = require("./webpack-stats.json");
}

export default function render(req, res, next) {
    try {

        // In development, reload webpack stats file on every request
        if (process.env.NODE_ENV === "development") {
            webpackStats = require("./webpack-stats.json");
            delete require.cache[require.resolve("./webpack-stats.json")];
        }

        Router.run(routes, req.path, function routeMatched(Root) {
            const markup = React.renderToString(<Root/>);
            // The application component is rendered to static markup
            // and sent as response.
            const html = React.renderToStaticMarkup(
              <HtmlDocument
                  markup={markup}
                  script={webpackStats.script}
                  css={webpackStats.css}
              />
            );
            const doctype = "<!DOCTYPE html>";

            res.send(doctype + html);
        });

    } catch (e) {
        next(e);
    }
}
