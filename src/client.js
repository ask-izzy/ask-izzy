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

    function goBack() {
        const currentUrl = location.toString();

        history.goBack();

        // If going back doesn't change the location, we've
        // run out of history. Send the user to the homepage
        setTimeout(
            () => {
                if (location.toString() == currentUrl) {
                    history.pushState(null, "/")
                }
            },
            100,
        );
    }

    function goForward() {
        history.goForward();
    }

    function pushState() {
        history.pushState(...arguments);
    }

    /* eslint-disable id-length */
    function go(num: number) {
        history.go(num);
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
    <Router history={History()}>{routes}</Router>,
    document.getElementById("root")
)

const debugEvent = new Event("debug");

window.pi = function() {
    window.debugQueries = true;
    window.dispatchEvent(debugEvent);
}
