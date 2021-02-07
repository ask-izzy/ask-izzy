/* @flow */

import fs from "fs";
import { dirname } from "path";
import url from "url";

import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import mkdirp from "mkdirp";

import routes from "../routes";

import HtmlDocument from "./HtmlDocument";
// $FlowIgnore
import webpackStats from "./webpack-stats";
import categories from "../constants/categories";
import Helmet from "react-helmet";

function hasVersionFile(): boolean {
    try {
        // Is there a version string?
        fs.accessSync("public/VERSION", fs.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

const version = hasVersionFile() &&
    fs.readFileSync("public/VERSION", "utf-8").trim();

function renderPage(uri: string, path: string, params: Object): void {
    const reqUrl = url.parse(uri);
    const context = {};

    if ((reqUrl.pathname && reqUrl.pathname.startsWith("/static/")) ||
    (reqUrl.pathname && reqUrl.pathname.startsWith("/session/"))) {
        // $FlowIgnore
        next();
    } else {

        const markup = ReactDOMServer.renderToString(
            <StaticRouter
                location={{pathname: reqUrl.pathname}}
                context={context}
                isRenderingStatic={true}
            >
                {routes}
            </StaticRouter>
        );

        const helmet = Helmet.renderStatic();

        // The application component is rendered to static markup
        // and sent as response.
        const html = ReactDOMServer.renderToString(
            <HtmlDocument
                markup={markup}
                script={webpackStats.script}
                css={webpackStats.css}
                helmet={helmet}
                currentUrl={reqUrl}
                envPath={version ?
                    `/static/env-${version}.js` : "/static/env.js"
                }
                requestInterceptorPath={version ?
                    `/static/scripts/request-interceptor-${version}.js`
                    : "/static/scripts/request-interceptor.js"
                }
                siteName="Ask Izzy"
                description={
                    `Ask Izzy is a mobile website that connects` +
                    ` people who are in crisis with the services` +
                    ` they need right now and nearby.`
                }
                ogTitle={
                    `Ask Izzy: Find the help you need, now and nearby`
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

        mkdirp.sync(`public/${dirname(path)}`)
        fs.writeFileSync(
            `public/${path}`,
            doctype + html
        );
        console.log(uri, path);
    }

}

function *expandRoutes(
    route: string,
): Iterable<string> {
    if (route && !route.match(/styleGuide/)) {
        let cleanedUrl = route
            .replace("/in/:suburb-:state", "")
            .replace("/:slug", "/slug")
            .replace("/:search", "/searchTerm");

        if (cleanedUrl.match(/:page/)) {
            for (const {key, personalisation} of categories) {
                let categoryUrl = cleanedUrl.replace(/:page/, key);

                if (categoryUrl.match(/:subpage/)) {
                    yield categoryUrl.replace(/:subpage/, "intro");
                    for (const question of personalisation) {
                        // Break out each personalisation URL
                        yield categoryUrl.replace(
                            /:subpage/,
                            question.defaultProps.name
                        );
                    }
                } else {
                    // Just the category page
                    yield categoryUrl;
                }
            }
        } else if (cleanedUrl.match(/:subpage/)) { // search personalisation
            yield cleanedUrl.replace("/:subpage", "/location");
        } else {
            yield cleanedUrl;
        }
    }
}

function getParamsFromPath(path: string, expandedPath: string): Object {
    // Given a path, convert params from :param format into a key:value pairs.
    let params = {}
    let pathParams = path.split("/")
    let expandedParams = expandedPath.split("/")

    pathParams.forEach((bit, index) => {
        if (bit.startsWith(":")) {
            params[bit.replace(":", "")] = expandedParams[index]
        }
    });

    return params
}

function renderRoute(route: React.Element<any>, prefix: string): void {
    // $FlowIgnore
    if (route.map) {
        route.map((route) => renderRoute(route, prefix));
        return;
    }
    let {path, children} = route.props;

    for (const expandedPath of expandRoutes(path)) {
        let params = getParamsFromPath(path, expandedPath)

        renderPage(
            expandedPath,
            expandedPath.replace("/searchTerm", "") + "/index.html",
            params
        );
    }

    for (const child of (children || [])) {
        renderRoute(child, prefix + path);
    }

}

renderRoute(routes, "");
