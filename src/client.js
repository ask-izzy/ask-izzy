/* @flow */

import React from "react";
import Router from "react-router";
import injectTapEventPlugin from "react-tap-event-plugin";

import routes from "./routes";

// For onTouchTap: see https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

Router.run(
    routes,
    Router.HistoryLocation,
    function routeMatched(Root) {
        React.render(
            <Root/>,
            document.getElementById("root"),
        );
    },
);
