/* @flow */
/* eslint-disable valid-jsdoc */
/* eslint-disable no-unused-vars */
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
            element={<NotFoundStaticPage />}
            onEnter={removeDoubleSlashOnEnter404}
            title="Ask Izzy Beta"
            type={["Ask Izzy Beta"]}
        />
        <Route
            path="*"
            element={<NotFoundStaticPage />}
            onEnter={removeDoubleSlashOnEnter404}
            title="Ask Izzy Beta"
            type={["Ask Izzy Beta"]}
        />
    </Route>
</Routes>

export default routes
