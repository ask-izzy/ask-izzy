/* @flow */

import React from "react";
import ReactDOM from "react-dom";
import Router from "react-router";
import createBrowserHistory from "history/lib/createBrowserHistory";
import storage from "./storage";
import routes from "./routes";
import searchTest from "./search-test";

window.searchTest = searchTest;

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
    let history = createBrowserHistory();
    let historyLength = storage.getHistoryLength();

    function setHistoryLength(newLength: number): void {
        historyLength = newLength;
        storage.setHistoryLength(newLength);
    }

    function goBack() {
        if (historyLength > 0) {
            setHistoryLength(historyLength - 1)
            history.goBack();
        } else {
            history.pushState(null, "/");
        }
        window.scrollTo(0, 0);
    }

    function goForward() {
        setHistoryLength(historyLength - 1);
        history.goForward();
        window.scrollTo(0, 0);
    }

    function pushState() {
        setHistoryLength(historyLength + 1);
        history.pushState(...arguments);
        window.scrollTo(0, 0);
    }

    /* eslint-disable id-length */
    function go(num: number) {
        setHistoryLength(historyLength + num);
        history.go(num);
        window.scrollTo(0, 0);
    }

    window._clear_history_testing = () => {
        history.go(-historyLength);
        window.scrollTo(0, 0);
    }

    return {
        ...history,
        goBack,
        goForward,
        pushState,
        go,
    };
}

ReactDOM.render(
    <Router
        history={History()}
        onUpdate={() => {
            if (typeof window.ga == "function") {
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
