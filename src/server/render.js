/* $FlowIgnore */
// Express middleware to render the app server-side and expose its state
// to the client

import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import url from "url";
import routes from "../routes";
import HtmlDocument from "./HtmlDocument";
import Helmet from "react-helmet";

let webpackStats;

if (process.env.NODE_ENV === "production") {
    webpackStats = require("./webpack-stats.json");
}

export default function render(req, res, next) {

    const context = {};

    // In development, reload webpack stats file on every request
    if (process.env.NODE_ENV === "development") {
        webpackStats = require("./webpack-stats.json");
        delete require.cache[require.resolve("./webpack-stats.json")];

        // Our Webpack setup writes complete URLs including
        // 'localhost' to 'webpack-stats.json'. To enable use
        // from other domains, we rewrite these asset links
        // to use the same domain as the original request.
        const replaceHostname = (assetUrl) => {
            let _url = url.parse(assetUrl);

            _url.host = `${req.hostname}:${_url.port || 80}`;
            return _url.format();
        }

        webpackStats.script = webpackStats.script.map(replaceHostname);
        webpackStats.css = webpackStats.css.map(replaceHostname);
    }

    const reqUrl = url.parse(req.url);

    // React Router doesn't like location objects with both a path and a
    // pathname property
    delete reqUrl.path

    if (reqUrl.pathname.startsWith("/static/") |
    reqUrl.pathname.startsWith("/session/")) {
        next();
    } else {
        const helmet = Helmet.renderStatic();

        const app = ReactDOMServer.renderToString(
            <StaticRouter location={req.url}
                context={context}
            >{routes}</StaticRouter>
        );

        if (context.url) {
            // Somewhere a `<Redirect>` was rendered
            res.redirect(302, context.url);
            return;
        }

        const html = ReactDOMServer.renderToString(
            <HtmlDocument
                markup={app}
                script={webpackStats.script}
                css={webpackStats.css}
                helmet={helmet}
                envPath={
                    "/static/env.js"
                }
                currentUrl={reqUrl}
                siteName="Ask Izzy"
                description={
                    `Ask Izzy is a mobile website that connects` +
                    ` people who are in crisis with the services` +
                    ` they need right now and nearby.`
                }
                ogTitle={
                    `Ask Izzy: Find the help you need, ` +
                    `now and nearby`
                }
                ogDescription={
                    `Ask Izzy is a mobile website that connects ` +
                    `people in need with housing, a meal, money ` +
                    `help, health and wellbeing services, family ` +
                    `violence support, counselling and much more.`
                }
            />
        );


        const doctype = "<!DOCTYPE html>";

        res.send(doctype + html);

    }
}
