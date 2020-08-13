/* @flow */
import categories from "./constants/categories";
import covidCategories from "./constants/covidSupportCategories";

export function emit(event: AnalyticsEvent, gtmId?: string): void {
    getDataLayer(gtmId).push(event)
    // flush variables non-persistent variables
    if (gtmId) {
        const varsToFlush = Object.keys(
            Object.assign({}, ...getDataLayer(gtmId))
        ).filter(key => !persistentVars.has(key))
        // If GTM has loaded then flush directly

        if (window.google_tag_manager) {
            for (const key of varsToFlush) {
                window.google_tag_manager[gtmId].dataLayer.set(key, undefined)
            }

        // Otherwise add event to flush vars
        } else {
            const eventVarsFlush = {event: "Flush Vars"}

            for (const key of varsToFlush) {
                eventVarsFlush[key] = undefined
            }
            getDataLayer(gtmId).push(eventVarsFlush)
        }
    }
}

export function getDataLayer(gtmId?: string): Array<Object> {
    gtmId = gtmId || window.GOOGLE_TAG_MANAGER_ID.split("~")[0]
    const key = `dataLayer${gtmId.split("-")[1]}`

    if (typeof window != "undefined") {
        window[key] = window[key] || [];
    }

    return window[key]
}

export type AnalyticsEvent = {
    event: string,
    eventCat?: string,
    eventAction?: string,
    eventLabel?: string,
    eventValue?: number,
    sendDirectlyToGA?: bool,
};

const pageVars = {
    category: undefined,
    covidCategory: undefined,
    pageType: undefined,
    routes: undefined,
    serviceListingType: undefined,
}

const persistentVars = new Set(["event", ...Object.keys(pageVars)])

export function setPageVars(routeMatch: Object, gtmId: string) {
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

    const event = Object.assign({}, {event: "Set Page Vars"}, pageVars)

    getDataLayer(gtmId).push(event)
}