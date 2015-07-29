/* @flow */

import React from "react";
import Router from 'react-router';

import BasePage from "./pages/BasePage";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import CategoryPage from "./pages/CategoryPage";

export default <Router.Route
        name="root"
        path="/"
        handler={BasePage}
    >
        <Router.Route
            name="home"
            path="/"
            handler={HomePage}
        />
        <Router.Route
            name="category"
            path=":categoryName"
            handler={CategoryPage}
        />
        <Router.DefaultRoute handler={ErrorPage}/>
    </Router.Route>;
