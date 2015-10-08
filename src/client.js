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
let history = createBrowserHistory();
const goBack = history.goBack;

history.goBack = () => {
    if (window.history.length == 1) {
        history.pushState(null, "/");
    } else {
        goBack.apply(history);
    }
}

React.render(
    <Router history={history}>{routes}</Router>,
    document.getElementById("root")
)
