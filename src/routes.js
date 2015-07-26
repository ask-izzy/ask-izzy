/* @flow */

import React from "react";
import Router from 'react-router';

import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import CategoryPage from "./pages/CategoryPage";

export default <Router.Route
        name="home"
        path="/"
        handler={HomePage}
    >
        <Router.Route
            name="category"
            path=":categoryName"
            handler={CategoryPage}
        />
        <Router.Route
            name="homelink"
            path="home"
            handler={HomePage}
        />
        <Router.DefaultRoute handler={ErrorPage}/>
    </Router.Route>;
