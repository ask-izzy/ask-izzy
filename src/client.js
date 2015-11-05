/* @flow */

import React from "react";
import ReactDOM from "react-dom";
import Router from "react-router";
import createBrowserHistory from "history/lib/createBrowserHistory";
import injectTapEventPlugin from "react-tap-event-plugin";

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
    let historyLength = 0;

    function goBack() {
        if (historyLength > 0) {
            historyLength--;
            history.goBack();
        } else {
            history.pushState(null, "/");
        }
    }

    function goForward() {
        historyLength++;
        history.goForward();
    }

    function pushState() {
        historyLength++;
        history.pushState(...arguments);
    }

    /* eslint-disable id-length */
    function go(num: number) {
        historyLength += num;
        history.go(num);
    }

    window._clear_history_testing = () => {
        history.go(-historyLength);
        historyLength = 0;
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

const debugEvent = new Event("debug");

window.pi = function() {
    window.debugQueries = true;
    window.dispatchEvent(debugEvent);
}
