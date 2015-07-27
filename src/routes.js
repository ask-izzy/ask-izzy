/* @flow */

import React from "react";
import Router from 'react-router';

import BasePage from "./pages/BasePage";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import CategoryPage from "./pages/CategoryPage";
import StyleGuideList from "./pages/StyleGuideList";
import StyleGuideItem from "./pages/StyleGuideItem";

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
            name="styleguideItem"
            path="/styleGuide/component/:componentName"
            handler={StyleGuideItem}
        />
        <Router.Route
            name="styleguideList"
            path="/styleGuide*"
            handler={StyleGuideList}
        />
        <Router.Route
            name="category"
            path=":categoryName"
            handler={CategoryPage}
        />
        <Router.DefaultRoute handler={ErrorPage}/>
    </Router.Route>;
