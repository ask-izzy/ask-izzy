/* flow:disable */
// Express middleware to render the app server-side and expose its state
// to the client

import React from "react";
import { match, RoutingContext } from "react-router";
import url from "url";
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

        match(
            { routes, location: url.parse(req.url) },
            (error, redirectLocation, renderProps) => {
                if (error) {
                    next(error);
                } else if (redirectLocation) {
                    res.redirect(
                        302,
                        redirectLocation.pathname +
                        redirectLocation.search
                    );
                } else if (renderProps) {
                    const markup = React.renderToString(
                        <RoutingContext {...renderProps} />
                    );
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
                } else {
                    res.status(404).send("Not found");
                }
            }
        )
    } catch (error) {
        next(error);
    }
}
