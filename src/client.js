import React from "react";
import Router from "react-router";
import routes from "./routes";

// Import normalized CSS
// TODO: normalize.css should not be javascript-ed
import "!style!css!./utils/normalize.css";

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
