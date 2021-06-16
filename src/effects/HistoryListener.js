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

        recordAnalytics(location, match);
    }, [locationPathAndSearch]);

    React.useEffect(
        () => registerScrollRestoration(location),
        [locationPathAndSearch]
    )

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

/*
Keep track of where we scroll to on a page and if we return to that page restore
the position. Since Izzy is a SPA app the standard browser scroll restoration
doesn't work but in the future browsers will hopefully do this for us (Chrome
already). But until then we've got to do it manually.
*/
function registerScrollRestoration(location) {
    if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
    }

    const sessionKey = `scrollPosition-${location.key}`
    const sessionValue = sessionStorage.getItem(sessionKey)

    if (sessionValue !== null) {
        waitTillPageLoaded().then(
            () => window.scrollTo(0, Number(sessionValue))
        ).catch()
    }

    function handleScroll() {
        sessionStorage.setItem(sessionKey, window.scrollY)
    }

    document.addEventListener("scroll", handleScroll)

    return () => document.removeEventListener("scroll", handleScroll);
}
