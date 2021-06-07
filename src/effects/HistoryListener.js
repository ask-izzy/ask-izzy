/* @flow */
import React from "react";

import * as gtm from "../google-tag-manager";
import { useRouterContext } from "../contexts/router-context";
import { waitTillPageLoaded } from "../utils/page-loading"
import categories from "../constants/categories"

export default (props: Object) => {
    const {location, match, navigateInProgress} = useRouterContext()
    const locationPathAndSearch = location.pathname + location.search

    React.useEffect(() => {
        // A page has requested to redirect as soon as it rendered. Don't count
        // this as a page view.
        if (navigateInProgress()) {
            return
        }

        window.scrollTo(0, 0);
        recordAnalytics(location, match);
    }, [locationPathAndSearch]);

    return null;
}

function recordAnalytics(location, routeMatch) {
    // Gather and set analytics environment variables
    const pageVars = getPageVars(routeMatch)
    gtm.setPersistentVars(Object.keys(pageVars))

    // Since Ask Izzy is a SPA we need to manually register each
    // new page view
    gtm.emit({
        event: "Page Loaded",
        path: location.pathname + location.search,
        hash: location.hash,
        ...pageVars,
    });
}

export function getPageVars(routeMatch: Object) {
    if (!routeMatch.props.type) {
        const errorMessage = `The current page "${routeMatch.url}" ` +
            `does not have a page type`
        console.warn(errorMessage)

        gtm.emit({
            event: "JS Error",
            eventCat: "Error Occurred",
            eventAction: "GTM",
            eventLabel: errorMessage,
            sendDirectlyToGA: true,
        });
    }

    const pageType = routeMatch.props.type ? [...routeMatch.props.type] : []

    // We declare some vars here even if we define them later
    // since the keys from pageVars get used to determine what
    // variables should be considered persistent in GTM (meaning
    // they last between GTM events until a new page is loaded).
    const pageVars = {
        category: undefined,
        pageType,
        routes: undefined,
    }

    if (routeMatch.params.page) {
        pageVars.category = categories.find(
            cat => cat.key === routeMatch.params.page
        )?.name || null
    }

    return pageVars
}

