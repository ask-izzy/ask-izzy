/* @flow */

import React from "react";
import Router from "react-router";
import createBrowserHistory from "history/lib/createBrowserHistory";
import injectTapEventPlugin from "react-tap-event-plugin";

import routes from "./routes";

// For onTouchTap: see https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

/*
 * If at any point there isn't a meaningful 'back',
 * go to the app homepage instead.
 */

function History() {
    let history = createBrowserHistory();

    function goBack() {
        if (window.history.length == 1) {
            history.pushState(null, "/");
        } else {
            history.goBack();
        }
    }

    return {
        ...history,
        goBack,
    };
}

React.render(
    <Router history={History()}>{routes}</Router>,
    document.getElementById("root")
)
