/* @flow */

import React from "react";
import { Route, Redirect } from "react-router";
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
import AddServicePage from "./pages/AddServicePage";
import TermsPage from "./pages/TermsPage";

import HomelessSheltersStaticPage from "./pages/HomelessSheltersStaticPage";
import FoodBanksStaticPage from "./pages/FoodBanksStaticPage";
import HomelessSupportStaticPage from "./pages/HomelessSupportStaticPage";
import HomelessLegalStaticPage from "./pages/HomelessLegalStaticPage";
import HomelessFinanceStaticPage from "./pages/HomelessFinanceStaticPage";
import HomelessHealthStaticPage from "./pages/HomelessHealthStaticPage";
import CensusStaticPage from "./pages/CensusStaticPage";
import InformationPage from "./pages/InformationPage";
import OnlineSafetyStaticPage from "./pages/OnlineSafetyStaticPage";

import PersonalisationWizardPage from "./pages/PersonalisationWizardPage";
import PersonalisationSummaryPage from "./pages/PersonalisationSummaryPage";
import {ResultsPageListing, ResultsPageMap} from "./pages/ResultsPage";
import ServicePage from "./pages/ServicePage";

export function makeTitle(routes: Array<Object>, params: Object): string {
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

    title = title.replace(" in :suburb, :state", "").replace(/:[^\s]+/, "");

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
        <Route
            path="/online-safety"
            component={OnlineSafetyStaticPage}
            title="Online Safety"
        />
        <Route
            path="/homeless-shelters"
            component={HomelessSheltersStaticPage}
            title="Homeless shelters"
        />
        <Route
            path="/food-banks"
            component={FoodBanksStaticPage}
            title="Food Banks"
        />
        <Route
            path="/homeless-support"
            component={HomelessSupportStaticPage}
            title="Homeless support"
        />
        <Route
            path="/homeless-legal-services"
            component={HomelessLegalStaticPage}
            title="Homeless Legal Services"
        />
        <Route
            path="/homeless-financial-support"
            component={HomelessFinanceStaticPage}
            title="Homeless financial support"
        />
        <Route
            path="/homeless-health-care"
            component={HomelessHealthStaticPage}
            title="Homeless Health Care"
        />
        <Route
            path="/census-2016"
            component={CensusStaticPage}
            title="2016 Census"
        />
        <Route
            path="/information"
            component={InformationPage}
            title="Information"
        />

        <Route
            path="/add-service"
            component={AddServicePage}
            title="Add a service"
        />
        <Route
            path="/service/:slug"
            component={ServicePage}
        />
        <Redirect
            from="/category/:page"
            to="/:page"
        />
        <Redirect
            from="/category/:page/in/:suburb-:state"
            to="/:page/:suburb-:state"
        />
        <Redirect
            from="/search/:search/in/:suburb-:state"
            to="/search/:search/:suburb-:state"
        />
        <Redirect
            from="/have-your-say"
            to="/advocacy"
        />
        <Redirect
            from="/have-your-say/:page"
            to="/advocacy/:page"
        />
        {[
            "/search/:search/:suburb-:state",
            "/search/:search",
            "/:page/:suburb-:state",
            "/:page",
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
    </Route>
);
