import React from "react";
import Router from "react-router";
import routes from "./routes";

// Add promise support for browser not supporting it
import es6Promise from "es6-promise";
es6Promise.polyfill();

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
