/* $FlowIgnore */

import xhr from "axios";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import categories from "./constants/categories";
import covidCategories from "./constants/covidSupportCategories";
import storage from "./storage";
import routes from "./routes";
import * as gtm from "./google-tag-manager";
import searchTest from "./search-test";
import history from "./utils/history";
import ScrollToTop from "./components/ScrollToTop";
import posthog from "./utils/posthog";
import { mapStackTrace } from "sourcemapped-stacktrace"; // Only used for
// debugging failed tests

window.searchTest = searchTest;

// Preventing the Google Maps libary from downloading an extra font
// http://stackoverflow.com/questions/25523806/google-maps-v3-prevent-api-from-loading-roboto-font
// $FlowIgnore - I have no idea why Flow doesn't like the following line
let head = document.getElementsByTagName("head")[0];
let insertBefore = head.insertBefore;

head.insertBefore = function(newElement, referenceElement) {
    // intercept font download
    if (newElement.href &&
        newElement.href.indexOf("https://fonts.googleapis.com/css?family=Roboto") === 0) {
        return;
    }

    insertBefore.call(head, newElement, referenceElement);
};

// Allow typography.com to record the hit for licencing
// This causes a CORS error after the request is run,
// which is not a problem as we don't need to do anything
// with the response.
xhr({
    url: "//" + window.PROXY_TYPOGRAPHY + "/7948374/730248/css/fonts.css",
    maxRedirects: 0,
}).catch(() => null);

ReactDOM.hydrate(
    <Router
        history={history}
        onUpdate={function() {
            // Since Ask Izzy is a SPA we need to manually register each
            // new page view
            gtm.emit({
                event: "Page Viewed",
            });

            const lastRecordedView = Array.from(gtm.getDataLayer("GTM-54BTPQM"))
                .reverse()
                .find(layer => layer.event === "Page Loaded")

            if (
                // Don't record page view if redirecting
                (location.pathname === this.state.location.pathname) &&
                // Make sure path has actually changed and not just the hash
                !(
                    lastRecordedView &&
                    location.pathname === lastRecordedView.path &&
                    location.hash !== lastRecordedView.hash
                )
            ) {
                // Gather and set analytics environment variables
                const pageVars = getPageVars(
                    this.state.routes,
                    this.state.params
                )

                gtm.setPersistentVars(Object.keys(pageVars))
                let hash = location.href.match(/(#[^#]*)$/)

                hash = hash && hash[1]
                gtm.emit({
                    event: "Page Loaded",
                    path: location.pathname,
                    hash,
                    ...pageVars,
                }, "GTM-54BTPQM");

                if (posthog.posthogShouldBeLoaded) {
                    posthog.client.capture("$pageview");
                }
            }
        }}
    >
        <ScrollToTop>
            {routes}
        </ScrollToTop>
    </Router>,
    document.getElementById("root")
)

// Can't use 'new Event' in IE
const debugEvent = document.createEvent("CustomEvent");

if (typeof debugEvent.initCustomEvent === "function") {
    debugEvent.initCustomEvent("debug", false, false, undefined);
}

window.pi = function() {
    storage.setDebug(!storage.getDebug());

    window.dispatchEvent(debugEvent);
}

// Report JS errors to google analytics
window.addEventListener("error", errEvent => {
    const error = errEvent.error
    if (window && window.isTestEnv) {
        // Selenium/Headless chrome doesn't yet support sourcemaps in error
        // stack traces. This makes debugging failing tests a bit tricky since
        // our prod source code is majorly transformed and minified. Until this
        // is done natively use a third party lib to help apply the source map
        // before showing the error.

        mapStackTrace(error.stack, (mappedStack) => {
            error.stack = [error.message, ...mappedStack].join("\n")
            console.log("The above error translated:")
            console.error(error)
        });
    }
    gtm.emit({
        event: "exception",
        exDescription: `JavaScript Error: ${error.message} ${error.filename}: ${
            evt.lineno
        }`,
    });
    gtm.emit({
        event: "JS Error",
        eventCat: "Error Occurred",
        eventAction: "Javascript",
        eventLabel: `${error.message}
            ${error.filename} [Line ${error.lineno}]
            From page: ${location.pathname}`.replace(/\n +/g, "\n"),
        sendDirectlyToGA: true,
    }, "GTM-54BTPQM");
});

export function getPageVars(routes: Object, routeParams: Object) {
    const pageVars = {
        category: undefined,
        covidCategory: undefined,
        pageType: undefined,
        routes: undefined,
        serviceListingType: undefined,
    }

    const routeState = Object.assign(
        {},
        ...routes.map(route => route.state)
    )

    pageVars.pageType = routeState.pageType
    pageVars.routes = routes.map(({name}) => ({name}))

    if (routes.find(route => route.name === "Service Listing")) {
        if (routeParams.page) {
            pageVars.serviceListingType = "Category"
            pageVars.category = categories
                .find(cat => cat.key === routeParams.page) ||
                null
        } else {
            pageVars.serviceListingType = "Search"
        }
    }

    if (routes.find(route => route.name === "Covid Support Category")) {
        pageVars.covidCategory = covidCategories
            .find(
                cat => cat.slug === routeParams.supportCategorySlug
            ) || null
    }

    return pageVars
}