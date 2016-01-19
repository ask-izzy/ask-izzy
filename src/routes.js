/* @flow */

import React from "react";
import { Route } from "react-router";
import { titleize } from "underscore.string";
import _ from "underscore";

// If you import these after the others,
// babel decides the navbar doesn't really
// need to be loaded.
import StyleGuideList from "./pages/StyleGuideList";
import StyleGuideItem from "./pages/StyleGuideItem";

import BasePage from "./pages/BasePage";
import BrandedFooter from "./components/BrandedFooter";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PersonalisationWizardPage from "./pages/PersonalisationWizardPage";
import PersonalisationSummaryPage from "./pages/PersonalisationSummaryPage";
import {ResultsPageListing, ResultsPageMap} from "./pages/ResultsPage";
import ServicePage from "./pages/ServicePage";

export function makeTitle(
    routes: Array<Object>,
    params: Object
): string {
    const template = _.chain(routes)
        .pluck("title")
        .compact()
        .last()
        .value();
    let unslug = (str) =>
        str.replace("-", " ").split(" ").map(titleize).join(" ");

    let title = template || "";

    Object.keys(params).forEach((key) => {
        // FIXME This is a hack. Rewrite it when we're not about to launch.
        if (key == "search") {
            title = title.replace(":page", unslug(params[key]));
        }
        title = title.replace(`:${key}`, unslug(params[key]));
    });

    return title ? `${title} | Ask Izzy` : "Ask Izzy";
}

export default (
    <Route
        path=""
        component={BasePage}
    >
        <Route
            path="/styleGuide/component/:componentName"
            component={StyleGuideItem}
            title="Styleguide"
        />
        <Route
            path="/styleGuide*"
            component={StyleGuideList}
            title="Styleguide"
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
            title="About"
        />
        <Route
            path="/terms"
            component={TermsPage}
            title="Terms of use"
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
                title=":page in :suburb, :state"
            />,
            <Route
                path={`${str}/map`}
                component={ResultsPageMap}
                title="Map of :page in :suburb, :state"
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
