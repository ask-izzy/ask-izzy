/* @flow */

import ansiEscapes from "ansi-escapes"
import fs from "fs-extra";
import { dirname } from "path";
import url from "url";

import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { Route } from "react-router";
import { StaticRouter } from "react-router-dom";
import mkdirp from "mkdirp";

import routes from "../routes";

import HtmlDocument from "./HtmlDocument";
// $FlowIgnore
import webpackStats from "./webpack-stats";
import categories from "../constants/categories";
import Category from "../constants/Category";
import Helmet from "react-helmet";

const versionFilePath = "public/VERSION"
const version = fs.existsSync(versionFilePath) &&
    fs.readFileSync(versionFilePath, "utf-8").trim();

function renderPage(uri: string, path: string, params: Object): void {
    const reqUrl = url.parse(uri);

    const markup = ReactDOMServer.renderToString(
        <StaticRouter location={{pathname: reqUrl.pathname}}
            isRenderingStatic={true}
        >{routes}</StaticRouter>
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
}

/**
 * For a given route with a path containing params in the :param format generate
 * all possible combinations of param values we want to render static pages for.
 * Each combination is an object containing params in the from of key => value.
 * The function returns an iterable list of these param value combinations.
 *
 * @param {Route} route - A React Router Route (or BasePage which extends it)
 *
 * @returns {Iterable<Object>} - Array of objects containing possible
 * combinations of prams for the given route.
 */
function* generateRouteParamVals(
    route: typeof Route,
    categories
): Iterable<Object> {
    const routePath = route.props.path

    if (!routePath) {
        return
    }

    const routePathParts = routePath
        .split("/") // 1-based index due to leading "/"
    const routeParams = routePathParts
        .filter(part => part.startsWith(":"))
        .map(param => param.substring(1))
    const defaultParamVals = {
        slug: "slug",
        search: "searchTerm",
    }

    if (routePathParts[1]?.startsWith("styleGuide")) {
        return
    } else if (routePathParts[1] === ":page") {
        // generate path for each category
        for (const {key, personalisation} of categories) {
            if (routeParams.includes("subpage")) {
                // generate subpage paths for category
                const subpages = [
                    "intro",
                    ...personalisation.map(
                        question => question.defaultProps.name
                    ),
                ]
                for (const subpage of subpages) {
                    yield {
                        ...defaultParamVals,
                        page: key,
                        subpage,
                    }
                }
            } else {
                // Just the root category page
                yield {
                    ...defaultParamVals,
                    page: key,
                };
            }
        }
    } else if (routePathParts[1] === "search") {
        yield {
            ...defaultParamVals,
            subpage: "location",
        }
    } else {
        yield defaultParamVals;
    }
}

/** Takes a route path and substitutes in param values
 *
 * @param {string} path - A path with colon-formatted params.
 * @param {Object} params - Params to insert into the path.
 *
 * @returns {string} - The path with params values inserted.
 */
function fillInPathParams(path: string, params: Object) {
    return path
        .split("/")
        .map(part => {
            if (part.startsWith(":") && part.substring(1) in params) {
                return params[part.substring(1)]
            } else {
                return part
            }
        })
        .filter(part => typeof part !== "undefined")
        .join("/")
}

/** Get a list of all paths we want to render pages for */
declare type NestedRoute = Array<NestedRoute> | typeof Route
declare type PageToRender = {urlPath: string, filePath: string, params: Object}
export function getPagesFromRoutes(
    route: NestedRoute,
    categories: Array<Category>
): Array<PageToRender> {
    if (route instanceof Array) {
        // $FlowIgnore .flat() not yet understood by flow
        return route.map(
            childRoute => getPagesFromRoutes(childRoute, categories)
        ).flat();
    }
    const pathsToRender = []

    for (const paramVals of generateRouteParamVals(route, categories)) {
        pathsToRender.push({
            urlPath: fillInPathParams(route.props.path, paramVals),
            filePath: fillInPathParams(
                route.props.path.replace(/^\/?/, "/"),
                {...paramVals, search: undefined}
            ).replace(/\/*$/, "/index.html"),
            params: paramVals,
        })
    }

    // Add paths from any child routes
    const children = route.props.children || []
    for (const child of children) {
        pathsToRender.push(...getPagesFromRoutes(child, categories))
    }

    return pathsToRender
}




export function main() {
    const pages = getPagesFromRoutes(routes, categories)

    process.stdout.write("  Rendering pages…")
    for (const [i, page] of pages.entries()) {
        process.stdout.write(
            ansiEscapes.eraseStartLine +
            ansiEscapes.cursorLeft +
            `  Rendering pages… ${i + 1} of ${pages.length}`
        );
        renderPage(page.urlPath, page.filePath, page.params);
    }
    console.log(
        ansiEscapes.eraseLines(1) +
        ansiEscapes.cursorLeft +
        `  Rendered ${pages.length} page${pages.length !== 1 ? "s" : ""}`
    );
}

// Render pages immediately if executed directly from the command line
if (require.main === module) {
    main()
}

