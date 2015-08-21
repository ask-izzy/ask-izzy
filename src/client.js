import React from "react";
import Router from "react-router";
import injectTapEventPlugin from "react-tap-event-plugin";

import routes from "./routes";

// Import CSS
// TODO: styles should not be javascript-dependant
import "!style!css!./styles/normalize.css";
import "!style!css!sass!./styles/responsive.scss";
import "!style!css!sass!./styles/components.scss";

// For onTouchTap: see https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.debug = require("debug");
const debug = window.debug("ask-izzy");
const mountNode = document.getElementById("root");

Router.run(
    routes,
    Router.HistoryLocation,
    function routeMatched(Root, state) {
        debug("Route change begins");
        React.render(
            <Root/>,
            mountNode,
            () => { debug("Route change rendered"); },

        );
    },
);
