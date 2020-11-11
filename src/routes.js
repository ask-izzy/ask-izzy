/* @flow */
/* eslint-disable valid-jsdoc */

import React from "react";
import {Redirect, Switch} from "react-router-dom";
import {titleize} from "underscore.string";

import posthog from "./utils/posthog"

// If you import these after the others,
// babel decides the navbar doesn't really
// need to be loaded.
import StyleGuideList from "./pages/StyleGuideList";
import StyleGuideItem from "./pages/StyleGuideItem";

import BasePage from "./pages/BasePage";
import HomePage from "./pages/HomePage";
import NotFoundStaticPage from "./pages/NotFoundStaticPage";
import AddServicePage from "./pages/AddServicePage";
import DynamicPage from "./pages/DynamicPage";

import PersonalisationWizardPage from "./pages/PersonalisationWizardPage";
import PersonalisationSummaryPage from "./pages/PersonalisationSummaryPage";
import {ResultsPageListing, ResultsPageMap} from "./pages/ResultsPage";
import ServicePage from "./pages/ServicePage";
import {CovidSupportPageListing} from "./pages/CovidSupportPage";

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
            state={{
                pageType: "Style Guide",
            }}
        />
        <BasePage
            path="/styleGuide*"
            component={StyleGuideList}
            title="Styleguide"
            state={{
                pageType: "Style Guide",
            }}
        />
        <BasePage
            path="/"
            component={posthog.injectFeatureFlags(HomePage)}
            exact={true}
            state={{
                pageType: "Home",
            }}
        />
        <BasePage
            path="/about"
            component={DynamicPage}
            title="About"
            state={{
                pageType: vars => [
                    "Static Page",
                    "About",
                ],
            }}
        />
        <BasePage
            path="/bushfire-support"
            component={DynamicPage}
            title="Bushfire Support"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Bushfire Support",
                ],
            }}
        />
        <BasePage
            path="/covid-19-support"
            component={DynamicPage}
            title="COVID 19 Support"
            exact={true}
            state={{
                pageType: vars => [
                    "Static Page",
                    "COVID 19 Support",
                ],
            }}
            exact={true}
        />
        <BasePage
            path="/covid-19-support/:supportCategorySlug"
            component={CovidSupportPageListing}
            name="Covid Support Category"
            title="COVID 19 Support"
            state={{
                pageType: vars => [
                    "Covid Support",
                    vars.covidCategoryDisplayName,
                ],
            }}
            exact={true}
        />
        <BasePage
            path="/terms"
            component={DynamicPage}
            title="Terms of use"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Terms of Use",
                ],
            }}
        />
        <BasePage
            path="/online-safety"
            component={DynamicPage}
            title="Online Safety"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Online Safety",
                ],
            }}
        />
        <BasePage
            path="/homeless-shelters"
            component={DynamicPage}
            title="Homeless shelters"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Homeless Shelters",
                ],
            }}
        />
        <BasePage
            path="/food-info"
            component={DynamicPage}
            title="Food"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Food",
                ],
            }}
        />
        <BasePage
            path="/homeless-support"
            component={DynamicPage}
            title="Homeless support"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Homeless Support",
                ],
            }}
        />
        <BasePage
            path="/homeless-legal-services"
            component={DynamicPage}
            title="Homeless Legal Services"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Homeless Legal Services",
                ],
            }}
        />
        <BasePage
            path="/homeless-financial-support"
            component={DynamicPage}
            title="Homeless financial support"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Homeless Financial Support",
                ],
            }}
        />
        <BasePage
            path="/homeless-health-care"
            component={DynamicPage}
            title="Homeless Health Care"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Homeless Health Care",
                ],
            }}
        />
        <BasePage
            path="/information"
            component={DynamicPage}
            title="Information"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Information",
                ],
            }}
        />
        <BasePage
            path="/not-found"
            component={NotFoundStaticPage}
            title="Page not found"
            state={{
                pageType: "Page Not Found",
            }}
        />
        <BasePage
            path="/add-service"
            component={AddServicePage}
            title="Add a service"
            state={{
                pageType: vars => [
                    "Static Page",
                    "Add a Service",
                ],
            }}
        />
        <BasePage
            path="/service/:slug"
            component={ServicePage}
            exact={true}
            state={{
                pageType: "Service",
            }}
        />
        <Redirect
            from="/category/:page"
            to="/:page"
            exact={true}
        />
        <Redirect
            from="/category/:page/in/:suburb-:state"
            to="/:page/:suburb-:state"
            exact={true}
        />
        <Redirect
            from="/search/:search/in/:suburb-:state"
            to="/search/:search/:suburb-:state"
            exact={true}
        />
        <Redirect
            from="/have-your-say"
            to="/advocacy"
            exact={true}
        />
        <Redirect
            from="/have-your-say/:page"
            to="/advocacy/:page"
            exact={true}
        />
        {[
            {
                resultsType: "Search",
                rootPath: "/search/:search/:suburb-:state",
            },
            {
                resultsType: "Search",
                rootPath: "/search/:search",
            },
            {
                resultsType: "Service Listing",
                rootPath: "/:page/:suburb-:state",
            },
            {
                resultsType: "Service Listing",
                rootPath: "/:page",
            },
        ].map(({resultsType, rootPath: str}) => [
            <BasePage
                path={`${str}`}
                component={ResultsPageListing}
                title=":page in :suburb, :state"
                exact={true}
                name={resultsType}
                state={{
                    pageType: vars => [
                        vars.serviceListingType,
                        "Results List",
                    ],
                }}
            />,
            <BasePage
                path={`${str}/map`}
                component={ResultsPageMap}
                title="Map of :page in :suburb, :state"
                exact={true}
                name={resultsType}
                state={{
                    pageType: vars => [
                        vars.serviceListingType,
                        "Results Map",
                    ],
                }}
            />,
            <BasePage
                path={`${str}/map/personalise`}
                component={PersonalisationWizardPage}
                exact={true}
                name={resultsType}
                title=":page Map Questions"
                state={{
                    pageType: vars => [
                        vars.serviceListingType,
                        "Results Map Personalisation",
                    ],
                }}
            />,
            <BasePage
                path={`${str}/map/personalise/page/:subpage`}
                component={PersonalisationWizardPage}
                exact={true}
                name={resultsType}
                title=":page Map Questions"
                state={{
                    pageType: vars => [
                        vars.serviceListingType,
                        "Results Map Personalisation",
                    ],
                }}
            />,
            <BasePage
                path={`${str}/map/personalise/summary`}
                component={PersonalisationSummaryPage}
                exact={true}
                name={resultsType}
                title=":page Map Questions"
                state={{
                    pageType: vars => [
                        vars.serviceListingType,
                        "Edit Map Personalisation",
                    ],
                }}
            />,
            <BasePage
                path={`${str}/map/personalise/summary/:subpage`}
                component={PersonalisationSummaryPage}
                exact={true}
                name={resultsType}
                title=":page Map Questions"
                state={{
                    pageType: vars => [
                        vars.serviceListingType,
                        "Edit Map Personalisation",
                    ],
                }}
            />,
            <BasePage
                path={`${str}/personalise`}
                component={PersonalisationWizardPage}
                exact={true}
                name={resultsType}
                title=":page Questions"
                state={{
                    pageType: vars => [
                        vars.serviceListingType,
                        "List Personalisation",
                    ],
                }}
            />,
            <BasePage
                path={`${str}/personalise/page/:subpage`}
                component={PersonalisationWizardPage}
                exact={true}
                name={resultsType}
                title=":page Questions"
                state={{
                    pageType: vars => [
                        vars.serviceListingType,
                        "List Personalisation",
                    ],
                }}
            />,
            <BasePage
                path={`${str}/personalise/summary`}
                component={PersonalisationSummaryPage}
                exact={true}
                name={resultsType}
                title=":page Questions"
                state={{
                    pageType: vars => [
                        vars.serviceListingType,
                        "Edit List Personalisation",
                    ],
                }}
            />,
            <BasePage
                path={`${str}/personalise/summary/:subpage`}
                component={PersonalisationSummaryPage}
                exact={true}
                name={resultsType}
                title=":page Questions"
                state={{
                    pageType: vars => [
                        vars.serviceListingType,
                        "Edit List Personalisation",
                    ],
                }}
            />,
        ])}
        <BasePage
            path="*"
            component={NotFoundStaticPage}
            onEnter={removeDoubleSlashOnEnter404}
            state={{
                pageType: "Page Not Found",
            }}
        />
    </Switch>

);
