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
            let catKey = this.state.params.page
            let catContentGroup = '[Non-Category Page]'
            let cat
            if (catKey) {
                cat = categories.find(cat => cat.key === catKey)
                if (cat) {
                    catContentGroup = cat.name
                } else {
                    catContentGroup = '[Not a Valid Category]'
                }
            }
            const routeState = this.state
                .routes[this.state.routes.length-1].state
            const pageTypeContentGroup = routeState && 
                routeState.pageTypeContentGroup
            sendEvent({
                category: (cat && cat.name) || undefined,
                catContentGroup,
                pageTypeContentGroup
            }, 'GTM-54BTPQM');

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
