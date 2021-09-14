/* $FlowIgnore */
// Express middleware to render the app server-side and expose its state
// to the client

import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
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
    }

    const reqUrl = url.parse(req.url);

    if (reqUrl.pathname.startsWith("/static/") |
    reqUrl.pathname.startsWith("/session/")) {
        next();
    } else {
        const helmet = Helmet.renderStatic();

        const app = ReactDOMServer.renderToString(
            <StaticRouter location={req.url}
                context={context}
                isRenderingStatic={false}
            >{routes}</StaticRouter>
        );

        if (context.url) {
            // Somewhere a `<Redirect>` was rendered
            res.redirect(302, context.url);
            return;
        }

        let html = ReactDOMServer.renderToString(
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

        // Note: The following behaviour should match the behaviour in
        // inject-config-on-deploy.sh
        const varsToInject = [
            "VERSION",
            "ISS_URL",
            "GOOGLE_API_KEY",
            "GOOGLE_ANALYTICS_URL",
            "GOOGLE_TAG_MANAGER_ID",
            "GOOGLE_TAG_MANAGER_AUTH",
            "GOOGLE_TAG_MANAGER_ENV",
            "PROXY_DOMAINS",
            "PROXY_PROTOCOL",
            "VERSION",
            "STRAPI_URL",
            "NEW_RELIC_CONFIG",
            "NEW_RELIC_INFO",
            "NOTIFICATIONS_API_URL",
            "NOTIFICATIONS_API_KEY",
        ]

        const requiredVars = [
            "VERSION",
            "ISS_URL",
            "PROXY_DOMAINS",
            "NEW_RELIC_CONFIG",
            "NEW_RELIC_INFO",
            "STRAPI_URL",
            "NOTIFICATIONS_API_URL",
            "NOTIFICATIONS_API_KEY",
        ]

        for (const varToInject of varsToInject) {
            if (
                !process.env.hasOwnProperty(varToInject) &&
                requiredVars.includes(varToInject)
            ) {
                throw new Error(
                    `Required environment variable "${varToInject}" is not set`
                )
            }
            html = html.replace(
                new RegExp("\\${" + varToInject + "}", "g"),
                process.env[varToInject] || ""
            )
        }


        const doctype = "<!DOCTYPE html>";

        res.send(doctype + html);

    }
}
