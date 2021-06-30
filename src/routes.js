/* @flow */
/* eslint-disable valid-jsdoc */

import React from "react";
import {
    Routes,
    Route as ReactRouterRoute,
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useParams,
    generatePath,
} from "react-router-dom";
import {titleize} from "underscore.string";

// If you import these after the others,
// babel decides the navbar doesn't really
// need to be loaded.
import StyleGuideList from "./pages/StyleGuideList";
import StyleGuideItem from "./pages/StyleGuideItem";

import BasePage from "./pages/BasePage";
import HomePage from "./pages/HomePage";
import NotFoundStaticPage from "./pages/NotFoundStaticPage";
import AddServicePage from "./pages/AddServicePage";
import BetaInfoStaticPage from "./pages/BetaInfoStaticPage";
import DisabilityAdvocacyFinder from "./pages/DisabilityAdvocacyFinder";
import DynamicPage from "./pages/DynamicPage";

import PersonalisationWizardPage from "./pages/PersonalisationWizardPage";
import PersonalisationSummaryPage from "./pages/PersonalisationSummaryPage";
import ResultsListPage from "./pages/ResultsListPage";
import ResultsMapPage from "./pages/ResultsMapPage";
import ServicePage from "./pages/ServicePage";
import BushfireReliefPage from "./pages/BushfireReliefPage";
import Covid19StaticPage from "./pages/Covid19StaticPage";
import { donateLink } from "./constants/urls.js"
import {
    InjectRouterContext,
    useRouterContext,
} from "./contexts/router-context"

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

function Route(props) {
    const routesConfig = createRoutesFromChildren(routes)
    const matchedRoutes = matchRoutes(routesConfig, useLocation().pathname)

    return <InjectRouterContext matchedRoutes={matchedRoutes}>
        <ReactRouterRoute {...props} />
    </InjectRouterContext>
}

function Redirect({path, to}) {
    const { navigate } = useRouterContext()
    navigate(generatePath(to, useParams()))
    return null
}

const routes = <Routes>
    <Route
        path="/"
        element={<BasePage />}
    >
        <Route
            path=""
            element={<HomePage />}
            type={["Home"]}
            scrollReset={true}
        />
        <Route
            path="/about"
            element={<DynamicPage />}
            title="About"
            type={["Static Page", "About"]}
            scrollReset={true}
        />
        <Route
            path="/styleGuide/component/:componentName"
            element={<StyleGuideItem />}
            title="Styleguide"
            type={["Old Style Guide"]}
        />
        <Route
            path="/styleGuide*"
            element={<StyleGuideList />}
            title="Styleguide"
            type={["Old Style Guide"]}
        />
        <Route
            path="/bushfire-support"
            element={<BushfireReliefPage />}
            title="Bushfire Support"
            type={["Static Page", "Bushfire Support"]}
            scrollReset={true}
        />
        <Route
            path="/covid-19-support"
            element={<Covid19StaticPage />}
            title="COVID 19 Support"
            type={["Static Page", "COVID 19 Support"]}
            scrollReset={true}
        />
        <Route
            path="/disability-advocacy-finder"
            element={<DisabilityAdvocacyFinder />}
            title="Disability Advocacy Finder"
            type={["Static Page", "Disability Advocacy Finder"]}
            scrollReset={true}
        />
        <Redirect
            path="/donate"
            to={donateLink}
        />
        <Route
            path="/terms"
            element={<DynamicPage />}
            title="Terms of use"
            type={["Static Page", "Terms of Use"]}
            scrollReset={true}
        />
        <Route
            path="/online-safety"
            element={<DynamicPage />}
            title="Online Safety"
            type={["Static Page", "Online Safety"]}
            scrollReset={true}
        />
        <Route
            path="/beta-info"
            element={<BetaInfoStaticPage />}
            title="About Ask Izzy Beta"
            type={["Static Page", "About Ask Izzy Beta"]}
            scrollReset={true}
        />
        <Route
            path="/homeless-shelters"
            element={<DynamicPage />}
            title="Homeless shelters"
            type={["Static Page", "Homeless Shelters"]}
            scrollReset={true}
        />
        <Route
            path="/food-info"
            element={<DynamicPage />}
            title="Food Info"
            strict={false}
            type={["Static Page", "Food"]}
            scrollReset={true}
        />
        <Route
            path="/using-ask-izzy"
            element={<DynamicPage />}
            title="Using Ask Izzy"
            type={["Static Page", "Using Ask Izzy"]}
            scrollReset={true}
        />
        <Route
            path="/homeless-legal-services"
            element={<DynamicPage />}
            title="Homeless Legal Services"
            type={["Static Page", "Homeless Legal Services"]}
            scrollReset={true}
        />
        <Route
            path="/homeless-financial-support"
            element={<DynamicPage />}
            title="Homeless financial support"
            type={["Static Page", "Homeless Financial Support"]}
            scrollReset={true}
        />
        <Route
            path="/homeless-health-care"
            element={<DynamicPage />}
            title="Homeless Health Care"
            type={["Static Page", "Homeless Health Care"]}
            scrollReset={true}
        />
        <Route
            path="/information"
            element={<DynamicPage />}
            title="Information"
            type={["Static Page", "Information"]}
            scrollReset={true}
        />
        <Route
            path="/disability-organisations"
            element={<DynamicPage />}
            title="Disability Organisations"
            type={["Static Page", "Disability Organisations"]}
            scrollReset={true}
        />
        <Route
            path="/search-help"
            element={<DynamicPage />}
            title="Ask Izzy search help"
            type={["Static Page", "Ask Izzy search help"]}
        />
        <Route
            path="/not-found"
            element={<NotFoundStaticPage />}
            title="Page not found"
            type={["Page Not Found"]}
        />
        <Route
            path="/add-service"
            element={<AddServicePage />}
            title="Add a service"
            type={["Static Page", "Add a Service"]}
            scrollReset={true}
        />
        <Route
            path="/service/:slug"
            title="Service Details"
            element={<ServicePage />}
            type={["Service"]}
            scrollReset={true}
        />
        <Redirect
            path="/category/:page"
            to="/:page"
        />
        <Redirect
            path="/category/:page/in/:suburb-:state"
            to="/:page/:suburb-:state"
        />
        <Redirect
            path="/search/:search/in/:suburb-:state"
            to="/search/:search/:suburb-:state"
        />
        <Redirect
            path="/have-your-say"
            to="/advocacy"
        />
        <Redirect
            path="/have-your-say/:page"
            to="/advocacy/:page"
        />
        {[
            {

                baseType: "Search",
                rootPath: "/search/:search/:suburb-:state",
            },
            {
                baseType: "Search",
                rootPath: "/search/:search",
            },
            {
                baseType: "Category",
                rootPath: "/:page/:suburb-:state",
            },
            {
                baseType: "Category",
                rootPath: "/:page",
            },
        ].map(({baseType, rootPath: str}) => [
            <Route
                path={`${str}`}
                element={<ResultsListPage />}
                title=":page in :suburb, :state"
                type={[baseType, "Results List"]}
            />,
            <Route
                path={`${str}/map`}
                element={<ResultsMapPage />}
                title="Map of :page in :suburb, :state"
                type={[baseType, "Results Map"]}
            />,
            <Route
                path={`${str}/map/personalise`}
                element={<PersonalisationWizardPage />}
                title=":page in :suburb, :state"
                type={[baseType, "Results Map Personalisation"]}
            />,
            <Route
                path={`${str}/map/personalise/page/:subpage`}
                element={<PersonalisationWizardPage />}
                title=":page in :suburb, :state"
                type={[baseType, "Results Map Personalisation"]}
            />,
            <Route
                path={`${str}/map/personalise/summary`}
                element={<PersonalisationSummaryPage />}
                title=":page in :suburb, :state"
                type={[baseType, "Edit Map Personalisation"]}
            />,
            <Route
                path={`${str}/personalise`}
                element={<PersonalisationWizardPage />}
                title=":page in :suburb, :state"
                type={[baseType, "List Personalisation"]}
            />,
            <Route
                path={`${str}/personalise/page/:subpage`}
                element={<PersonalisationWizardPage />}
                title=":page in :suburb, :state"
                type={[baseType, "List Personalisation"]}
            />,
            <Route
                path={`${str}/personalise/summary`}
                element={<PersonalisationSummaryPage />}
                title=":page in :suburb, :state"
                type={[baseType, "Edit List Personalisation"]}
            />,
            <Route
                path={`${str}/personalise/summary/:subpage`}
                element={<PersonalisationSummaryPage />}
                title=":page in :suburb, :state"
                type={[baseType, "Edit List Personalisation"]}
            />,
        ])}
        <Route
            path="*"
            element={<NotFoundStaticPage />}
            onEnter={removeDoubleSlashOnEnter404}
            title="Page not found"
            type={["Page Not Found"]}
        />
    </Route>
</Routes>

export default routes
