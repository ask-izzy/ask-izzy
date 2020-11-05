/* @flow */
/* eslint-disable valid-jsdoc */
import React from "react";
import type {Element as ReactElement} from "React";
import {
    Routes,
    Route as ReactRouterRoute,
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useParams,
    generatePath,
} from "react-router-dom";

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
import { donateLink } from "./constants/urls.js"
import {
    InjectRouterContext,
    useRouterContext,
} from "./contexts/router-context"

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

const routes: ReactElement<typeof Routes> = <Routes>
    <Route
        path="/"
        element={<BasePage />}
    >
        <Route
            path=""
            element={<HomePage />}
            type={["Home"]}
        />
        <Route
            path="/about"
            element={<DynamicPage />}
            title="About"
            type={["Static Page", "About"]}
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
        />
        <Route
            path="/covid-19-support"
            element={<DynamicPage />}
            title="COVID 19 Support"
            type={["Static Page", "COVID 19 Support"]}
        />
        <Route
            path="/disability-advocacy-finder"
            element={<DisabilityAdvocacyFinder />}
            title="Disability Advocacy Finder"
            type={["Static Page", "Disability Advocacy Finder"]}
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
        />
        <Route
            path="/online-safety"
            element={<DynamicPage />}
            title="Online Safety"
            type={["Static Page", "Online Safety"]}
        />
        <Route
            path="/beta-info"
            element={<BetaInfoStaticPage />}
            title="About the Beta"
            type={["Static Page", "Beta Info"]}
        />
        <Route
            path="/homeless-shelters"
            element={<DynamicPage />}
            title="Homeless shelters"
            type={["Static Page", "Homeless Shelters"]}
        />
        <Route
            path="/food-info"
            element={<DynamicPage />}
            title="Food Info"
            strict={false}
            type={["Static Page", "Food"]}
        />
        <Route
            path="/using-ask-izzy"
            element={<DynamicPage />}
            title="Help using Ask Izzy"
            type={["Static Page", "Using Ask Izzy"]}
        />
        <Route
            path="/homeless-legal-services"
            element={<DynamicPage />}
            title="Homeless Legal Services"
            type={["Static Page", "Homeless Legal Services"]}
        />
        <Route
            path="/homeless-financial-support"
            element={<DynamicPage />}
            title="Homeless financial support"
            type={["Static Page", "Homeless Financial Support"]}
        />
        <Route
            path="/homeless-health-care"
            element={<DynamicPage />}
            title="Homeless Health Care"
            type={["Static Page", "Homeless Health Care"]}
        />
        <Route
            path="/information"
            element={<DynamicPage />}
            title="Information"
            type={["Static Page", "Information"]}
        />
        <Route
            path="/disability-organisations"
            element={<DynamicPage />}
            title="Disability Organisations"
            type={["Static Page", "Disability Organisations"]}
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
        />
        <Route
            path="/service/:slug"
            title="Service Details"
            element={<ServicePage />}
            type={["Service"]}
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
                title="Results list"
                type={[baseType, "Results List"]}
            />,
            <Route
                path={`${str}/map`}
                element={<ResultsMapPage />}
                title="Results map"
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
                title="Edit questions"
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
                title="Edit questions"
                type={[baseType, "Edit List Personalisation"]}
            />,
            <Route
                path={`${str}/personalise/summary/:subpage`}
                element={<PersonalisationSummaryPage />}
                title="Edit questions"
                type={[baseType, "Edit questions Personalisation"]}
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
