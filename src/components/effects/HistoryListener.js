/* @flow */
import storage from "../../storage";
// flow:disable flowjs needs to be updated to include useEffect
import { useState, useEffect, useContext } from "react";
import * as gtm from "../../google-tag-manager";
import posthog from "../../utils/posthog";
import covidCategories from "../../constants/covidSupportCategories";
import categories from "../../constants/categories";
import routerContext from "../../contexts/router-context";

export default (props: Object) => {
    const {router} = useContext(routerContext)

    const [previousLocation, setPreviousLocation] = useState(undefined);

    // Use the Effects Hook to modify history and setup listener only once
    // (by using an empty array as useEffect's second argument).
    useEffect(() => {
        // Override the goBack function for the history object to navigate to
        // the home page if going to the previous page will take the user off
        // Ask Izzy
        const originalGoBackFunc = router.history.goBack;

        router.history.goBack = () => {
            storage.getHistoryLength() > 0 ?
                originalGoBackFunc()
                : router.history.push("/")
        }

        router.history.listen((location, action) => {
            // Track size of history stack while navigating Ask Izzy so we
            // know if the previous page is part of ask izzy or not.
            // NOTE: action isn't a particularly reliable way of tracking
            // changes to the history stack. Among other issues the value of
            // action is "POP" both when the browser back button is used as well
            // as when the forward button is used. Still there's no reliable way
            // to do this so until browser APIs change this will have to do.
            let historyLengthDelta = 0

            if (action === "POP") {
                historyLengthDelta = -1;
            } else if (action === "PUSH") {
                historyLengthDelta = 1;
            }

            if (historyLengthDelta) {
                storage.setHistoryLength(
                    storage.getHistoryLength() +
                    historyLengthDelta
                )
            }
        });
    }, [])

    // useEffect to fire after neighbouring elements have finished rendering
    // so we can detect if they triggered a redirect or not. We don't set the
    // second argument here so this is fired every time a re-render occurs.
    // NOTE: history is a mutable object and therefore it's values may change
    // by time we get around to reading it (for example if a redirect has
    // occurred in between). So if we need to access say history.action then
    // we should copy it first to preserve it's current value.
    useEffect(() => {
        // Location hasn't change but setting the state on last change
        // has caused this to fire again so we can safely ignore
        if (previousLocation === router.location) {
            return undefined
        }

        // Page path hasn't changed, generally occurs when an anchor link is
        // clicked
        if (previousLocation?.pathname === router.location.pathname) {
            return undefined
        }
        // If location doesn't match browser location we know a redirect has
        // occurred
        if (
            router.location.pathname !== window.location.pathname ||
            router.location.search !== window.location.search ||
            router.location.hash !== window.location.hash
        ) {
            return undefined
        }

        window.scrollTo(0, 0);
        recordAnalytics(router.match);

        setPreviousLocation(router.location)
    });
    return null
}

function recordAnalytics(routeMatch) {
    // Since Ask Izzy is a SPA we need to manually register each
    // new page view
    gtm.emit({
        event: "Page Viewed",
    });

    // Gather and set analytics environment variables
    const pageVars = getPageVars(routeMatch)
    gtm.setPersistentVars(Object.keys(pageVars))

    let hash = location.href.match(/(#[^#]*)$/)
    gtm.emit({
        event: "Page Loaded",
        path: location.pathname,
        hash,
        ...pageVars,
    }, "GTM-54BTPQM");

    if (posthog.posthogShouldBeLoaded) {
        posthog.client.capture("$pageview");
    }
}

export function getPageVars(routeMatch: Object) {
    const pageVars = {
        category: undefined,
        covidCategory: undefined,
        pageType: undefined,
        routes: undefined,
        serviceListingType: undefined,
    }

    const routeParams = routeMatch.params
    const routeState = routeMatch.props.state
    pageVars.pageType = routeState.pageType

    if (routeMatch.props.name === "Service Listing") {
        if (routeParams.page) {
            pageVars.serviceListingType = "Category"
            pageVars.category = categories
                .find(cat => cat.key === routeParams.page) ||
                null
        } else {
            pageVars.serviceListingType = "Search"
        }
    }

    if (routeMatch.props.name === "Covid Support Category") {
        pageVars.covidCategory = covidCategories
            .find(
                cat => cat.slug === routeParams.supportCategorySlug
            ) || null
    }

    return pageVars
}