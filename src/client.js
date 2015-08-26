/* @flow */

"use strict";

import React from "react";
import Router from "react-router";
import injectTapEventPlugin from "react-tap-event-plugin";

import routes from "./routes";

// For onTouchTap: see https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.debug = require("debug");
var debug = window.debug("ask-izzy");
var mountNode = document.getElementById("root");

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
