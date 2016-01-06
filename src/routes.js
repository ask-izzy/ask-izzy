/* @flow */

import React from "react";
import { Route } from "react-router";

// If you import these after the others,
// babel decides the navbar doesn't really
// need to be loaded.
import StyleGuideList from "./pages/StyleGuideList";
import StyleGuideItem from "./pages/StyleGuideItem";

import BasePage from "./pages/BasePage";
import BrandedFooter from "./components/BrandedFooter";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PersonalisationWizardPage from "./pages/PersonalisationWizardPage";
import PersonalisationSummaryPage from "./pages/PersonalisationSummaryPage";
import {ResultsPageListing, ResultsPageMap} from "./pages/ResultsPage";
import ServicePage from "./pages/ServicePage";

export default (
    <Route
        path=""
        component={BasePage}
    >
        <Route
            path="/styleGuide/component/:componentName"
            component={StyleGuideItem}
        />
        <Route
            path="/styleGuide*"
            component={StyleGuideList}
        />
        <Route
            path="/"
            components={{
                main: HomePage,
                footer: BrandedFooter,
            }}
        />
        <Route
            path="/about"
            component={AboutPage}
        />
        {[
            "/category/:page",
            "/category/:page/in/:suburb-:state",
            "/search/:search",
            "/search/:search/in/:suburb-:state",
        ].map((str) => [
            <Route
                path={`${str}`}
                component={ResultsPageListing}
            />,
            <Route
                path={`${str}/map`}
                component={ResultsPageMap}
            />,
            <Route
                path={`${str}/map/personalise`}
                component={PersonalisationWizardPage}
            />,
            <Route
                path={`${str}/map/personalise/page/:subpage`}
                component={PersonalisationWizardPage}
            />,
            <Route
                path={`${str}/map/personalise/summary`}
                component={PersonalisationSummaryPage}
            />,
            <Route
                path={`${str}/map/personalise/summary/:subpage`}
                component={PersonalisationSummaryPage}
            />,
            <Route
                path={`${str}/personalise`}
                component={PersonalisationWizardPage}
            />,
            <Route
                path={`${str}/personalise/page/:subpage`}
                component={PersonalisationWizardPage}
            />,
            <Route
                path={`${str}/personalise/summary`}
                component={PersonalisationSummaryPage}
            />,
            <Route
                path={`${str}/personalise/summary/:subpage`}
                component={PersonalisationSummaryPage}
            />,
        ])}
        <Route
            path="/service/:slug"
            component={ServicePage}
        />
    </Route>
);
