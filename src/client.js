/* flow:disable */

import xhr from "axios";
import React from "react";
import ReactDOM from "react-dom";
import {Router, browserHistory} from "react-router";
import storage from "./storage";
import routes from "./routes";
import sendEvent from "./google-tag-manager";
import searchTest from "./search-test";
import categories from "./constants/categories";
import covidCategories from "./constants/covidSupportCategories";
import posthog from "./utils/posthog";

window.searchTest = searchTest;
window.categories = categories;

// Preventing the Google Maps libary from downloading an extra font
// http://stackoverflow.com/questions/25523806/google-maps-v3-prevent-api-from-loading-roboto-font
// flow:disable - I have no idea why Flow doesn't like the following line
let head = document.getElementsByTagName("head")[0];
let insertBefore = head.insertBefore;

head.insertBefore = function(newElement, referenceElement) {
    // intercept font download
    if (newElement.href &&
        newElement.href.indexOf("https://fonts.googleapis.com/css?family=Roboto") === 0) {
        return;
    }

    // intercept analytics download
    if (newElement.src &&
        newElement.src.indexOf("http://www.google-analytics.com/analytics.js") === 0) {
        newElement.src = `/static/analytics-${window.VERSION}.js`
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

/*
 * If at any point there isn't a meaningful 'back',
 * go to the app homepage instead.
 *
 * We use a function instead of subclassing because
 * the builtins of `history` check that you're
 * calling them on the right object and bail
 * otherwise.
 *
 * FIXME: Once react-router has a built-in solution
 * for tracking scroll position, remove window.scrollTo calls
 */
function History() {
    let historyLength = storage.getHistoryLength();

    function setHistoryLength(newLength: number): void {
        historyLength = newLength;
        storage.setHistoryLength(newLength);
    }

    function goBack() {
        if (historyLength > 0) {
            setHistoryLength(historyLength - 1)
            browserHistory.goBack();
        } else {
            browserHistory.push("/");
        }
        window.scrollTo(0, 0);
    }

    function goForward() {
        setHistoryLength(historyLength - 1);
        browserHistory.goForward();
        window.scrollTo(0, 0);
    }

    function push() {
        setHistoryLength(historyLength + 1);
        browserHistory.push(...arguments);
        window.scrollTo(0, 0);
    }

    /* eslint-disable id-length */
    function go(num: number) {
        setHistoryLength(historyLength + num);
        browserHistory.go(num);
        window.scrollTo(0, 0);
    }

    window._clear_history_testing = () => {
        browserHistory.go(-historyLength);
        window.scrollTo(0, 0);
    }

    return {
        ...browserHistory,
        goBack,
        goForward,
        push,
        go,
    };
}

ReactDOM.hydrate(
    <Router
        history={History()}
        onUpdate={function () {
            // Gather and set analytics environment variables
            const routeParams = this.state.params
            const routes = this.state.routes
            const routeState = Object.assign(
                {},
                ...routes.map(route => route.state)
            )
            const pageVars = {
                resultsType: undefined,
                category: undefined,
                categoryDisplayName: undefined,
                covidCategory: undefined,
                covidCategoryDisplayName: undefined,
                pageType: undefined,
                
            }
            if (routes.find(r => r.name === 'Service Listing')) {
                if (routeParams.page) {
                    pageVars.resultsType = 'Category'
                    pageVars.category = categories
                        .find(cat => cat.key === routeParams.page) ||
                        null
                } else {
                    pageVars.resultsType = 'Search'
                }
            }
            if (pageVars.category === undefined) {
                pageVars.categoryDisplayName = '[Non-Category Page]'
            } else if (pageVars.category === null) {
                pageVars.categoryDisplayName = '[Not a Valid Category]'
            } else {
                pageVars.categoryDisplayName = pageVars.category.name
            }

            if (routes.find(r => r.name === 'Covid Support Category')) {
                pageVars.covidCategory = covidCategories
                    .find(
                        cat => cat.slug === routeParams.supportCategorySlug
                    ) || null
            }
            if (pageVars.covidCategory === undefined) {
                pageVars.covidCategoryDisplayName = '[Non-Covid Category Page]'
            } else if (pageVars.covidCategory === null) {
                pageVars.covidCategoryDisplayName = '[Not a Valid Covid Category]'
            } else {
                pageVars.covidCategoryDisplayName = pageVars.covidCategory.title
            }

            let pageType = routeState.pageType
            if (typeof pageType === 'function') {
                pageType = pageType(pageVars)
            }
            if (pageType instanceof Array) {
                pageType = pageType.filter(type => type)
            } else {
                pageType = [pageType]
            }
            pageVars.pageType = pageType

            const gtmVars = Object.assign({}, pageVars, {
                contentGroup_PageTypeLevel1: pageVars
                    .pageType.slice(0, 1).join(" - "),
                contentGroup_PageTypeLevel2: pageVars
                    .pageType.slice(0, 2).join(" - "),
                contentGroup_PageTypeLevel3: pageVars
                    .pageType.slice(0, 3).join(" - "),
            })

            sendEvent(gtmVars, 'GTM-54BTPQM');

            // Don't record page view if redirecting
            if(location.pathname === this.state.location.pathname) {
                // Since Ask Izzy is a SPA we need to manually register each
                // new page view
                sendEvent({
                    event: "Page Viewed",
                });
                sendEvent({
                    event: "Page Viewed",
                }, 'GTM-54BTPQM');

                if (posthog.posthogShouldBeLoaded) {
                    posthog.client.capture("$pageview");
                }
            }
        }}
    >{routes}</Router>,
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
window.addEventListener("error", (e) => {
    sendEvent({
        event: "exception",
        exDescription: `JavaScript Error: ${e.message} ${e.filename}: ${
            e.lineno
        }`,
    });
});
