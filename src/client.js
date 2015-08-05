import React from "react";
import Router from "react-router";
import routes from "./routes";
import fetch from "whatwg-fetch";

// Import CSS
// TODO: styles should not be javascript-dependant
import "!style!css!./styles/normalize.css";
import "!style!css!sass!./components/HeaderBar.scss";

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
