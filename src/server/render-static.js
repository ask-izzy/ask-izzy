/* @flow */

import fs from "fs";
import { dirname } from "path";
import url from "url";

import React from "react";
import ReactDOMServer from "react-dom/server";
import { match, RoutingContext } from "react-router";
import mkdirp from "mkdirp";

import routes, { makeTitle } from "../routes";
import badRouteParams from "./not_found";
import HtmlDocument from "./HtmlDocument";
// flow:disable
import webpackStats from "./webpack-stats";
import categories from "../constants/categories";

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
            const title = makeTitle(
                renderProps.routes,
                renderProps.params
            )
            const markup = ReactDOMServer.renderToString(
                <RoutingContext {...renderProps} />
            );

            // The application component is rendered to static markup
            // and sent as response.
            const html = ReactDOMServer.renderToStaticMarkup(
              <HtmlDocument
                  title={title}
                  markup={markup}
                  script={webpackStats.script}
                  css={webpackStats.css}
                  currentUrl={reqUrl}
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

function renderRoute(
    route: ReactComponent,
    prefix: string,
): void {
    if (route.map) {
        route.map((route) => renderRoute(route, prefix));
        return;
    }
    let {path, children} = route.props;

    for (const expandedPath of expandRoutes(path)) {
        renderPage(expandedPath, expandedPath + "/index.html");
    }

    for (const child of (children || [])) {
        renderRoute(child, prefix + path);
    }

}

renderRoute(routes, "", "");
