/* @flow */
/* eslint-disable valid-jsdoc */

import React from "react";
import {Route, Redirect, Switch} from "react-router-dom";
import {titleize} from "underscore.string";
import _ from "underscore";

// If you import these after the others,
// babel decides the navbar doesn't really
// need to be loaded.
import StyleGuideList from "./pages/StyleGuideList";
import StyleGuideItem from "./pages/StyleGuideItem";

import BasePage from "./pages/BasePage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import NotFoundStaticPage from "./pages/NotFoundStaticPage";
import AddServicePage from "./pages/AddServicePage";
import TermsPage from "./pages/TermsPage";

import HomelessSheltersStaticPage from "./pages/HomelessSheltersStaticPage";
import FoodBanksStaticPage from "./pages/FoodBanksStaticPage";
import HomelessSupportStaticPage from "./pages/HomelessSupportStaticPage";
import HomelessLegalStaticPage from "./pages/HomelessLegalStaticPage";
import HomelessFinanceStaticPage from "./pages/HomelessFinanceStaticPage";
import HomelessHealthStaticPage from "./pages/HomelessHealthStaticPage";
import InformationPage from "./pages/InformationPage";
import OnlineSafetyStaticPage from "./pages/OnlineSafetyStaticPage";

import PersonalisationWizardPage from "./pages/PersonalisationWizardPage";
import PersonalisationSummaryPage from "./pages/PersonalisationSummaryPage";
import {ResultsPageListing, ResultsPageMap} from "./pages/ResultsPage";
import ServicePage from "./pages/ServicePage";
import BushfireReliefPage from "./pages/BushfireReliefPage";
import Covid19StaticPage from "./pages/Covid19StaticPage";

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
        if (key === "search") {
            title = title.replace(":page", unslug(params[key]));
        }
        title = title.replace(`:${key}`, unslug(params[key]));
    });

    title = title.replace(" in :suburb, :state", "").replace(/:[^\s]+/, "");

    return title ? `${title} | Ask Izzy` : "Ask Izzy";
}

/**
 * While entering the 404 page,
 * if the pathname contains double slashes
 * this hook will remove the them from the next state
 */
const removeDoubleSlashOnEnter404 = (
    nextState: Object,
    replace: Function
): void => {
    let nextPathName = nextState.location.pathname;
    let needChangePath = false;

    // remove double slashes
    const regex = new RegExp("/{2,}", "g");

    if (nextPathName.match(regex)) {
        needChangePath = true;
        nextPathName = nextPathName.replace(regex, "/");
    }

    if (needChangePath) {
        // change to the new path
        replace(nextPathName);
    }

};

export const routeList = (
    <Switch>
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
            component={HomePage}
            exact={true}
        />
        <Route
            path="/about"
            component={AboutPage}
            title="About"
        />
        <Route
            path="/bushfire-support"
            component={BushfireReliefPage}
            title="Bushfire Support"
        />
        <Route
            path="/covid-19-support"
            component={Covid19StaticPage}
            title="COVID 19 Support"
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
            path="/information"
            component={InformationPage}
            title="Information"
        />

        <Route
            path="/not-found"
            component={NotFoundStaticPage}
            title="Page not found"
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
                exact={true}
            />,
            <Route
                path={`${str}/map`}
                component={ResultsPageMap}
                title="Map of :page in :suburb, :state"
                exact={true}
            />,
            <Route
                path={`${str}/map/personalise`}
                component={PersonalisationWizardPage}
                exact={true}
            />,
            <Route
                path={`${str}/map/personalise/page/:subpage`}
                component={PersonalisationWizardPage}
                exact={true}
            />,
            <Route
                path={`${str}/map/personalise/summary`}
                component={PersonalisationSummaryPage}
                exact={true}
            />,
            <Route
                path={`${str}/map/personalise/summary/:subpage`}
                component={PersonalisationSummaryPage}
                exact={true}
            />,
            <Route
                path={`${str}/personalise`}
                component={PersonalisationWizardPage}
                exact={true}
            />,
            <Route
                path={`${str}/personalise/page/:subpage`}
                component={PersonalisationWizardPage}
                exact={true}
            />,
            <Route
                path={`${str}/personalise/summary`}
                component={PersonalisationSummaryPage}
                exact={true}
            />,
            <Route
                path={`${str}/personalise/summary/:subpage`}
                component={PersonalisationSummaryPage}
                exact={true}
            />,
        ])}
        <Route
            path="*"
            component={NotFoundStaticPage}
            onEnter={removeDoubleSlashOnEnter404}
        />
    </Switch>

);


export default (
    <BasePage>
        {routeList}
    </BasePage>
);
