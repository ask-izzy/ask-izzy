/* @flow */
/* eslint-disable valid-jsdoc */

import React from "react";
import {Redirect, Switch} from "react-router-dom";
import {titleize} from "underscore.string";

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

export function makeTitle(route: string, params: Object): string {
    let unslug = (str) =>
        str.replace("-", " ").split(" ").map(titleize).join(" ");

    let title = route || "";

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

export default (
    <Switch>
        <BasePage
            path="/styleGuide/component/:componentName"
            component={StyleGuideItem}
            title="Styleguide"
        />
        <BasePage
            path="/styleGuide*"
            component={StyleGuideList}
            title="Styleguide"
        />
        <BasePage
            path="/"
            component={HomePage}
            exact={true}
        />
        <BasePage
            path="/about"
            component={AboutPage}
            title="About"
        />
        <BasePage
            path="/bushfire-support"
            component={BushfireReliefPage}
            title="Bushfire Support"
        />
        <BasePage
            path="/covid-19-support"
            component={Covid19StaticPage}
            title="COVID 19 Support"
        />
        <BasePage
            path="/terms"
            component={TermsPage}
            title="Terms of use"
        />
        <BasePage
            path="/online-safety"
            component={OnlineSafetyStaticPage}
            title="Online Safety"
        />
        <BasePage
            path="/homeless-shelters"
            component={HomelessSheltersStaticPage}
            title="Homeless shelters"
        />
        <BasePage
            path="/food-banks"
            component={FoodBanksStaticPage}
            title="Food Banks"
        />
        <BasePage
            path="/homeless-support"
            component={HomelessSupportStaticPage}
            title="Homeless support"
        />
        <BasePage
            path="/homeless-legal-services"
            component={HomelessLegalStaticPage}
            title="Homeless Legal Services"
        />
        <BasePage
            path="/homeless-financial-support"
            component={HomelessFinanceStaticPage}
            title="Homeless financial support"
        />
        <BasePage
            path="/homeless-health-care"
            component={HomelessHealthStaticPage}
            title="Homeless Health Care"
        />
        <BasePage
            path="/information"
            component={InformationPage}
            title="Information"
        />
        <BasePage
            path="/not-found"
            component={NotFoundStaticPage}
            title="Page not found"
        />
        <BasePage
            path="/add-service"
            component={AddServicePage}
            title="Add a service"
        />
        <BasePage
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
            <BasePage
                path={`${str}`}
                component={ResultsPageListing}
                title=":page in :suburb, :state"
                exact={true}
            />,
            <BasePage
                path={`${str}/map`}
                component={ResultsPageMap}
                title="Map of :page in :suburb, :state"
                exact={true}
            />,
            <BasePage
                path={`${str}/map/personalise`}
                component={PersonalisationWizardPage}
                exact={true}
            />,
            <BasePage
                path={`${str}/map/personalise/page/:subpage`}
                component={PersonalisationWizardPage}
                exact={true}
            />,
            <BasePage
                path={`${str}/map/personalise/summary`}
                component={PersonalisationSummaryPage}
                exact={true}
            />,
            <BasePage
                path={`${str}/map/personalise/summary/:subpage`}
                component={PersonalisationSummaryPage}
                exact={true}
            />,
            <BasePage
                path={`${str}/personalise`}
                component={PersonalisationWizardPage}
                exact={true}
            />,
            <BasePage
                path={`${str}/personalise/page/:subpage`}
                component={PersonalisationWizardPage}
                exact={true}
            />,
            <BasePage
                path={`${str}/personalise/summary`}
                component={PersonalisationSummaryPage}
                exact={true}
            />,
            <BasePage
                path={`${str}/personalise/summary/:subpage`}
                component={PersonalisationSummaryPage}
                exact={true}
            />,
        ])}
        <BasePage
            path="*"
            component={NotFoundStaticPage}
            onEnter={removeDoubleSlashOnEnter404}
        />
    </Switch>

);
