/* @flow */

import React from "react";
import ReactDOM from "react-dom";
import Router from "react-router";
import createBrowserHistory from "history/lib/createBrowserHistory";
import injectTapEventPlugin from "react-tap-event-plugin";
import sessionstorage from "sessionstorage";
import a11y from "react-a11y";

import routes from "./routes";

// For onTouchTap: see https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

/*
 * If at any point there isn't a meaningful 'back',
 * go to the app homepage instead.
 *
 * We use a function instead of subclassing because
 * the builtins of `history` check that you're
 * calling them on the right object and bail
 * otherwise.
 */
function History() {
    let history = createBrowserHistory();
    let historyLength = parseInt(
        sessionstorage.getItem("historyLength") || ""
    ) || 0;

    function setHistoryLength(newLength: number): void {
        historyLength = newLength;
        sessionstorage.setItem("historyLength", `${newLength}`);
    }

    function goBack() {
        if (historyLength > 0) {
            setHistoryLength(historyLength - 1)
            history.goBack();
        } else {
            history.pushState(null, "/");
        }
    }

    function goForward() {
        setHistoryLength(historyLength - 1);
        history.goForward();
    }

    function pushState() {
        setHistoryLength(historyLength + 1);
        history.pushState(...arguments);
    }

    /* eslint-disable id-length */
    function go(num: number) {
        setHistoryLength(historyLength + num);
        history.go(num);
    }

    window._clear_history_testing = () => {
        history.go(-historyLength);
    }

    return {
        ...history,
        goBack,
        goForward,
        pushState,
        go,
    };
}

if (a11y) {
    a11y(React, {includeSrcNode: true});
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
    window.debugQueries = true;
    window.dispatchEvent(debugEvent);
}
