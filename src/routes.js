/* @flow */
/* eslint-disable valid-jsdoc */

import React from "react";
import {Route, Redirect} from "react-router";
import {titleize} from "underscore.string";
import _ from "underscore";

import posthog from "./utils/posthog"

// If you import these after the others,
// babel decides the navbar doesn't really
// need to be loaded.
import StyleGuideList from "./pages/StyleGuideList";
import StyleGuideItem from "./pages/StyleGuideItem";

import BasePage from "./pages/BasePage";
import BrandedFooter from "./components/BrandedFooter";
import HomePage from "./pages/HomePage";
import NotFoundStaticPage from "./pages/NotFoundStaticPage";
import AddServicePage from "./pages/AddServicePage";
import DynamicPage from "./pages/DynamicPage";

import PersonalisationWizardPage from "./pages/PersonalisationWizardPage";
import PersonalisationSummaryPage from "./pages/PersonalisationSummaryPage";
import {ResultsPageListing, ResultsPageMap} from "./pages/ResultsPage";
import ServicePage from "./pages/ServicePage";
import {CovidSupportPageListing} from "./pages/CovidSupportPage";

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

export default (
    <Route
        path=""
        component={BasePage}
    >
        <Route
            path="/styleGuide/component/:componentName"
            component={StyleGuideItem}
            title="Styleguide"
            state={{
                pageType: "Style Guide",
            }}
        />
        <Route
            path="/styleGuide*"
            component={StyleGuideList}
            title="Styleguide"
            state={{
                pageType: "Style Guide",
            }}
        />
        <Route
            path="/"
            components={{
                main: posthog.injectFeatureFlags(HomePage),
                footer: BrandedFooter,
            }}
            state={{
                pageType: "Home",
            }}
        />
        <Route
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
        <Route
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
        <Route
            path="/covid-19-support"
            component={DynamicPage}
            title="COVID 19 Support"
            state={{
                pageType: vars => [
                    "Static Page",
                    "COVID 19 Support",
                ],
            }}
        />
        <Route
            path="/covid-19-support/:supportCategorySlug"
            component={props => (
                <CovidSupportPageListing
                    key={props.params.supportCategorySlug}
                    {...props}
                />
            )}
            name="Covid Support Category"
            title="COVID 19 Support"
            state={{
                pageType: vars => [
                    "Covid Support",
                    vars.covidCategoryDisplayName,
                ],
            }}
        />
        <Route
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
        <Route
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
        <Route
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
        <Route
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
        <Route
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
        <Route
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
        <Route
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
        <Route
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
        <Route
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

        <Route
            path="/not-found"
            component={NotFoundStaticPage}
            title="Page not found"
            state={{
                pageType: "Page Not Found",
            }}
        />
        <Route
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
        <Route
            path="/service/:slug"
            component={ServicePage}
            state={{
                pageType: "Service",
            }}
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
        <Route
            path=""
            name="Service Listing"
        >
            {[
                "/search/:search/:suburb-:state",
                "/search/:search",
                "/:page/:suburb-:state",
                "/:page",
            ].map(str => [
                <Route
                    path={`${str}`}
                    component={ResultsPageListing}
                    title=":page in :suburb, :state"
                    state={{
                        pageType: vars => [
                            vars.serviceListingType,
                            "Results List",
                        ],
                    }}
                />,
                <Route
                    path={`${str}/map`}
                    component={ResultsPageMap}
                    title="Map of :page in :suburb, :state"
                    state={{
                        pageType: vars => [
                            vars.serviceListingType,
                            "Results Map",
                        ],
                    }}
                />,
                <Route
                    path={`${str}/map/personalise`}
                    component={PersonalisationWizardPage}
                    state={{
                        pageType: vars => [
                            vars.serviceListingType,
                            "Results Map Personalisation",
                        ],
                    }}
                />,
                <Route
                    path={`${str}/map/personalise/page/:subpage`}
                    component={PersonalisationWizardPage}
                    state={{
                        pageType: vars => [
                            vars.serviceListingType,
                            "Results Map Personalisation",
                        ],
                    }}
                />,
                <Route
                    path={`${str}/map/personalise/summary`}
                    component={PersonalisationSummaryPage}
                    state={{
                        pageType: vars => [
                            vars.serviceListingType,
                            "Edit Map Personalisation",
                        ],
                    }}
                />,
                <Route
                    path={`${str}/map/personalise/summary/:subpage`}
                    component={PersonalisationSummaryPage}
                    state={{
                        pageType: vars => [
                            vars.serviceListingType,
                            "Edit Map Personalisation",
                        ],
                    }}
                />,
                <Route
                    path={`${str}/personalise`}
                    component={PersonalisationWizardPage}
                    state={{
                        pageType: vars => [
                            vars.serviceListingType,
                            "List Personalisation",
                        ],
                    }}
                />,
                <Route
                    path={`${str}/personalise/page/:subpage`}
                    component={PersonalisationWizardPage}
                    state={{
                        pageType: vars => [
                            vars.serviceListingType,
                            "List Personalisation",
                        ],
                    }}
                />,
                <Route
                    path={`${str}/personalise/summary`}
                    component={PersonalisationSummaryPage}
                    state={{
                        pageType: vars => [
                            vars.serviceListingType,
                            "Edit List Personalisation",
                        ],
                    }}
                />,
                <Route
                    path={`${str}/personalise/summary/:subpage`}
                    component={PersonalisationSummaryPage}
                    state={{
                        pageType: vars => [
                            vars.serviceListingType,
                            "Edit List Personalisation",
                        ],
                    }}
                />,
            ])}
        </Route>
        <Route
            path="*"
            component={NotFoundStaticPage}
            onEnter={removeDoubleSlashOnEnter404}
            state={{
                pageType: "Page Not Found",
            }}
        />
    </Route>
);
