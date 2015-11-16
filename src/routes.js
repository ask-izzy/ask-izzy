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
        <Route
            path="/category/:page"
            component={ResultsPageListing}
        />
        <Route
            path="/category/:page/map"
            component={ResultsPageMap}
        />
        <Route
            path="/category/:page/map/personalise"
            component={PersonalisationWizardPage}
        />
        <Route
            path="/category/:page/map/personalise/page/:subpage"
            component={PersonalisationWizardPage}
        />
        <Route
            path="/category/:page/map/personalise/summary"
            component={PersonalisationSummaryPage}
        />
        <Route
            path="/category/:page/map/personalise/summary/:subpage"
            component={PersonalisationSummaryPage}
        />
        <Route
            path="/category/:page/personalise"
            component={PersonalisationWizardPage}
        />
        <Route
            path="/category/:page/personalise/page/:subpage"
            component={PersonalisationWizardPage}
        />
        <Route
            path="/category/:page/personalise/summary"
            component={PersonalisationSummaryPage}
        />
        <Route
            path="/category/:page/personalise/summary/:subpage"
            component={PersonalisationSummaryPage}
        />
        <Route
            path="/search/:search"
            component={ResultsPageListing}
        />
        <Route
            path="/search/:search/map"
            component={ResultsPageMap}
        />
        <Route
            path="/search/:search/personalise"
            component={PersonalisationWizardPage}
        />
        <Route
            path="/search/:search/personalise/page/:subpage"
            component={PersonalisationWizardPage}
        />
        <Route
            path="/search/:search/personalise/summary"
            component={PersonalisationSummaryPage}
        />
        <Route
            path="/search/:search/personalise/summary/:subpage"
            component={PersonalisationSummaryPage}
        />
        <Route
            path="/service/:slug"
            component={ServicePage}
        />
    </Route>
);
