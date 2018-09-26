/* @flow */

import fs from "fs";
import { dirname } from "path";
import url from "url";

import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { match, RouterContext } from "react-router";
import mkdirp from "mkdirp";

import routes, { makeTitle } from "../routes";
import badRouteParams from "./not_found";
import HtmlDocument from "./HtmlDocument";
// flow:disable
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

function renderPage(uri: string, path: string): void {
    const reqUrl = url.parse(uri);

    match(
        { routes, location: reqUrl },
        (error, redirectLocation, renderProps) => {
            if (error) {
                throw error;
            } else if (redirectLocation) {
                throw badRouteParams;
            } else if (!renderProps) {
                throw badRouteParams;
            }
            renderProps.router = Object.assign(
                {},
                renderProps.router,
                {
                    isRenderingStatic: true,
                }
            )
            const title = makeTitle(
                renderProps.routes,
                renderProps.params
            )
            const markup = ReactDOMServer.renderToString(
                <RouterContext {...renderProps} />
            );

            if (renderProps.router.params.subpage === "online-safety-screen") {
                console.log(markup);
            }

            const helmet = Helmet.renderStatic();

            // The application component is rendered to static markup
            // and sent as response.
            const html = ReactDOMServer.renderToStaticMarkup(
                <HtmlDocument
                    title={title}
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
                        `Ask Izzy helps people who are homeless ` +
                      `or at risk of becoming homeless to find` +
                      ` the services they need, right now and nearby.`
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
    )
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

function renderRoute(route: React.Element<any>, prefix: string): void {
    // flow:disable
    if (route.map) {
        route.map((route) => renderRoute(route, prefix));
        return;
    }
    let {path, children} = route.props;

    for (const expandedPath of expandRoutes(path)) {
        renderPage(
            expandedPath,
            expandedPath.replace("/searchTerm", "") + "/index.html"
        );
    }

    for (const child of (children || [])) {
        renderRoute(child, prefix + path);
    }

}

renderRoute(routes, "");
