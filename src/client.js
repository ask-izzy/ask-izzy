/* $FlowIgnore */

import xhr from "axios";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import storage from "./storage";
import routes from "./routes";
import sendEvent from "./google-tag-manager";
import searchTest from "./search-test";
import categories from "./constants/categories";
import HistoryListener from "./components/effects/HistoryListener"
import { mapStackTrace } from "sourcemapped-stacktrace"; // Only used for
// debugging failed tests

window.searchTest = searchTest;
window.categories = categories;

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

const Router = typeof document !== "undefined" ?
    BrowserRouter
    : MemoryRouter

ReactDOM.hydrate(
    <Router>
        <HistoryListener/>
        {routes}
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
window.addEventListener("error", (evt) => {
    const error = evt.error
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
    sendEvent({
        event: "exception",
        exDescription: `JavaScript Error: ${evt.message} ${evt.filename}: ${
            evt.lineno
        }`,
    });
});
