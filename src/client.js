/* @flow */

import React from "react";
import ReactDOM from "react-dom";
import {Router, browserHistory} from "react-router";
import storage from "./storage";
import routes from "./routes";
import sendEvent from "./google-tag-manager";
import searchTest from "./search-test";
import categories from "./constants/categories";

// Polyfill for ie10
/* eslint-disable no-proto */
if (!(Object.setPrototypeOf || {}.__proto__)) {
    let nativeGetPrototypeOf = Object.getPrototypeOf;

    // flow:disable this ie10 does not conform to this rule
    Object.getPrototypeOf = function(object) {
        /* eslint-disable no-proto */
        if (object.__proto__) {
            return object.__proto__;
        } else {
            return nativeGetPrototypeOf.call(Object, object);
        }
    }
}

window.searchTest = searchTest;
window.categories = categories;

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

ReactDOM.render(
    <Router
        history={History()}
        onUpdate={() => {
            // Don't inform Google Analytics if the user makes a
            // search. This prevents us from recording the fact that a
            // user has searched for e.g., "domestic violence" in
            // Google Analytics. In turn, this should prevent Google
            // from linking that fact with the user's profile. Since
            // ISS3 logs all searches which are made, we still get
            // insight into the what kind of searches users are
            // performing.
            if (!window.location.pathname.match("/search") &&
                (typeof window.ga == "function")) {
                window.ga("send", "pageview", window.location.toString());
            }
        }}
    >{routes}</Router>,
    document.getElementById("root")
)

// Can't use 'new Event' in IE
const debugEvent = document.createEvent("CustomEvent");

if (typeof debugEvent.initCustomEvent == "function") {
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
