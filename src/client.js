/* @flow */

import React from "react";
import Router from "react-router";
import createBrowserHistory from "history/lib/createBrowserHistory";
import injectTapEventPlugin from "react-tap-event-plugin";

import routes from "./routes";

// For onTouchTap: see https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

let history = createBrowserHistory();

React.render(
    <Router history={history}>{routes}</Router>,
    document.getElementById("root")
)
